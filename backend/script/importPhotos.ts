import * as API from "../app/common/ifaces";
import db from "../app/sup/db";

import * as fs from "fs";
import * as path from "path";
import "reflect-metadata";

// for this it's necessarry to comment lines 5 and 7 (if not changed since this commit) in db.ts file
let dbase = new db();

let thumbdir = "/var/www/vps.sukovec.cz/thumbs";

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

    dirs.forEach( (dir) => {
        //let directory = path.join(thumbdir, dir);
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

function parseDate(dir: string, fname: string) {
    return new Date();
}

function parseTags(tags: string, tb: tagbase): API.PhotoTagset {
    let ret: API.PhotoTagset = {};
    if (tags == "") return ret;
    
    tags.split(",").forEach( (itm) => {
        let spl = itm.split(":");

        let usedTag = tb[spl[0]];
        console.log(`Parsing: '${itm}', got '${spl[0]}' and ${spl[1]}`);
        ret[usedTag._id] = { subtag: spl[1] };
    });

    return ret;
}

// TODO: Need to do this with some ini-parser for real data
function readCsvFile(fname: string, dir: string, dbase: db, tb: tagbase) {
    let file = fs.readFileSync(fname).toString();

    file.split("\n").filter(itm => itm != "").map( (val) => {
        let spl = val.split(";");
        return {
            thumb: spl[0],
            orig: spl[1],
            cmt: spl[2],
            tags: spl[3]
        };
    }).forEach( (img) => {
        let doc: API.Photo = {
            tags: parseTags(img.tags, tb),
            source: decidePhotoSource(dir, fname),
            date: parseDate(dir, fname),
            folder: dir,
            original: img.orig,
            thumb: img.thumb,
            type: decidePhotoFormat(img.orig),
            comment: img.cmt
        };

        dbase.photos.insert(doc, (err, doc) => {
            console.assert(err == null, "The document was not inserted");

            console.log(`ID: ${doc._id}, file: ${doc.folder}/${doc.original}`);
        });
    })
}
console.log("loadtags");
loadTags(dbase).then( (res) => {
    console.log("processPhotos");
    processPhotos(thumbdir, dbase, res);
});