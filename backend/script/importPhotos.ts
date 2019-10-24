throw new Error("There is no reason to use this anymore");

import * as fs from "fs";
import * as path from "path";
import * as parse from "csv-parse/lib/sync";
import * as moment from "moment";

const exif = require("node-exiftool");
const exifproc = new exif.ExiftoolProcess();

import "reflect-metadata";

import CFG from "../app/const/config";
import * as API from "../app/common/ifaces";
import db from "../app/services/db";

// for this it's necessarry to comment lines 5 and 7 (if not changed since this commit) in db.ts file
let dbase = new db();

let thumbdir = "/var/www/vps.sukovec.cz/thumbs";

let Photodocs: Array<API.Photo> = [];
let nodatenum = Number.MIN_SAFE_INTEGER; // for the images with no date or even no file (shouldn't exist at all, but for the case...)

type tagbase = {[key: string]: API.PhotoTag};

function loadTags(dbase: db): Promise<tagbase> {
    return new Promise((res, rej) => {
        dbase.phtags.find({}, (err: any, docs: API.PhotoTag[]) => {
            if (err) return rej(err);

            let ret: {[key:string]:API.PhotoTag} = {};
            docs.forEach( (itm)=> {
                ret[itm.tagName] = itm;
            });

            res(ret);
        });
    });
}

function processPhotos(thumbdir: string, dbase: db, tb: tagbase) {
    let dirs = fs.readdirSync(thumbdir);

    dirs.map((dir) => {
        let tagfile = path.join(thumbdir, dir, ".tag-index");
        if (fs.existsSync(tagfile)) {
            readCsvFile(tagfile, dir, dbase, tb);
        } else {
            console.warn(`There is a directory ${dir} without .tag-index!`);
        }
    });
}

function decidePhotoSource(dir: string, file: string): API.PhotoSource {
    let rexp = [
        {
            rx: /^sarka-([0-9]{4})([0-9]{2})([0-9]{2})$/,
            ps: API.PhotoSource.sarkofon
        },
        {
            rx: /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
            ps: API.PhotoSource.camera
        },
        {
            rx: /^sukofon-([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
            ps: API.PhotoSource.sukofon
        },
        {
            rx: /^ticofon-([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
            ps: API.PhotoSource.ticofon
        },
    ];

    for (let i = 0; i < rexp.length; i++) {
        if (!rexp.hasOwnProperty(i)) continue;

        if (rexp[i].rx.test(dir))
            return rexp[i].ps;
    }

    throw new Error("Not even one regexp passed well, it probably means a directory has a wrong name and I cannot decide the source, sorry");
}

function decidePhotoFormat(fname: string): API.PhotoType {
    let rexp = [ 
        {
            rx: /\.(jpg|jpeg)$/,
            fr: API.PhotoType.jpg
        },
        {
            rx: /\.(rw2)$/,
            fr: API.PhotoType.rw2
        }
    ];


    for (let i = 0; i < rexp.length; i++) {
        if (!rexp.hasOwnProperty(i)) continue;

        if (rexp[i].rx.test(fname.toLowerCase()))
            return rexp[i].fr;
    }

    return API.PhotoType.oth; // something other, TODO: add format for video
}

function parseTags(tags: string, tb: tagbase): API.PhotoTagset {
    let ret: API.PhotoTagset = {};
    if (!tags) return ret;

    tags.split(",").forEach( (itm) => {
        let spl = itm.split(":");

        let usedTag = tb[spl[0]];
        ret[usedTag._id] = { subtag: spl[1] };
    });

    return ret;
}

function readCsvFile(fname: string, dir: string, dbase: db, tb: tagbase) {
    let file = fs.readFileSync(fname, { encoding: "utf8" }).toString();
    let data = parse(file, { columns: false, skip_empty_lines: true, delimiter: ";" });

    data.forEach((spl: string[]) => {
        Photodocs.push({
            tags: parseTags(spl[3], tb),
            source: decidePhotoSource(dir, fname),
            date: 0, /// will be read from EXIF
            folder: dir,
            original: spl[1],
            thumb: spl[0],
            type: decidePhotoFormat(spl[1]),
            comment: spl[2]
        });
    });
};
/*
        return 
        */
    //})

function addExifInfo(doc: API.Photo, exifproc: any): Promise<API.Photo> {
    console.log(`addExifInfo: ${doc.folder}/${doc.original}`);
    return exifproc.readMetadata(path.join(CFG.rawPath, doc.folder, doc.original), ["-File:all"])
    .then( (res: any) => {
        if (res.error && res.data == null){
            doc.date = nodatenum++; // indicate problem
            return doc; // nothing inside
        } 
        let obj = res.data[0];
        let parsdate = moment.utc(obj.CreateDate, "YYYY:MM:DD HH:mm:ss", true).add(-5, "hour");
        doc.date = parsdate.unix();
        return doc;
    });
}

function saveToDatabase(doc: API.Photo, dbase: db): Promise<API.Photo> {
    return new Promise( (res, rej) => {
        console.log(`saveToDatabase: ${doc.folder}/${doc.original}`)
        dbase.photos.insert(doc, (err, doc) => {
            if (err) return rej(err);

            console.log(`    ID: ${doc._id}, dtime: ${doc.date}`);
            
            res(doc);
        });
    });
}

exifproc.open().then( () => {
    console.log("started exif process, load tags");
    return loadTags(dbase);
}).then( (res: tagbase) => {
    console.log("process all those csvs");
    processPhotos(thumbdir, dbase, res);
    console.log(`Processed, have ${Photodocs.length} documents prepared`);
    console.log("-------------------------");

    let prm: Promise<any> = Promise.resolve();
    for (let i = 0; i < Photodocs.length; i++) {
        prm = prm.then( () => {
            return addExifInfo(Photodocs[i], exifproc);
        }).then( (res: API.Photo) => {
            return saveToDatabase(res, dbase);
        });
    }
    return prm;

}).then( () => {
    console.log("Closing...");
    exifproc.close();
})