import * as fs from "fs";
import * as path from "path";
import * as moment from "moment";
import { execFile } from "child_process";

const exif = require("node-exiftool");
const exifproc = new exif.ExiftoolProcess();

import CFG from "../app/const/config";
import * as API from "../app/common/ifaces";

import { login, fetch } from "./login";

let nodatenum = Number.MIN_SAFE_INTEGER; // for the images with no date or even no file (shouldn't exist at all, but for the case...)

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

async function readExifDate(photofile: string): Promise<number> {
    let mdata = await exifproc.readMetadata(photofile, ["-File:all"]);

    if (mdata.error && mdata.data == null) {
        return nodatenum++;
    }

    let parsdate = moment.utc(mdata.data[0].CreateDate, "YYYY:MM:DD HH:mm:ss", true).add(-5, "hour");
    return parsdate.unix();
}

function execCommand(cmd: string, args: string[]): Promise<{ stdo: string, stde: string }> {
    return new Promise((res, rej) => {
        let prc = execFile(cmd, args, (err, stdOut, stdErr) => {
            if (err) return rej(err);

            res({ stdo: stdOut, stde: stdErr });
        });

        prc.stdout.on('data', function (data) {
            console.log(`stdout(${cmd})`, data);
        });
        prc.stderr.on('data', function (data) {
            console.log(`stderr(${cmd})`, data);
        });
    });
}

async function extractRW2Thumbnail(photofile: string, outdir: string): Promise<string> {
    await execCommand("exiv2", ["-f", "-ep2", "-l", outdir, photofile]); // does not return anything
    let outfname = path.basename(photofile, path.extname(photofile)) + "-preview2.jpg";

    if (fs.existsSync(path.join(outdir, outfname)))
        return outfname;
    else throw new Error("Supposed thumbnail file was not outputted");
}

async function makeJpegThumbnail(photofile: string, outdir: string): Promise<string> {
    let newfile = path.basename(photofile);
    let dest = path.join(outdir, newfile);
    await execCommand("convert", [
        "-auto-orient",
        "-resize",
        "640x480",
        photofile,
        dest]);

    if (fs.existsSync(dest))
        return newfile;
    else throw new Error("Supposed thumbnail file was not outputted");
}

function createThumbFile(type: API.PhotoType, cfile: string, thumbdir: string): Promise<string> {
    switch (type) {
        case API.PhotoType.rw2:
            return extractRW2Thumbnail(cfile, thumbdir);
        case API.PhotoType.jpg:
            return makeJpegThumbnail(cfile, thumbdir);
        default:
            throw new Error("Unknown image type");
    }
}

function getFileList(dir: string) {
    return fs.readdirSync(dir);
}

async function uploadDocument(doc: API.Photo): Promise<API.RespID> {
    let reply;
    try {
        reply = await fetch(`http://localhost:${CFG.serverPort}/api/photos/photo`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(doc)
        });
    } catch(e) {
        console.error("Connecting to server failed, porque: ", e);
        return null;
    }

    let body: API.APIResponse<API.RespID> = await reply.json();

    if (body.result == API.APIResponseResult.Fail)
        return null;

    return body.data;
    
}

async function removeDocument(id: string): Promise<boolean> {
    // TODO: chaneable port in config
    let reply = await fetch(`http://127.0.0.1:9080/api/photos/photo/${id}`, { method: "DELETE" });
    let body: API.APIResponse<API.RespID> = await reply.json();

    return body.result == API.APIResponseResult.OK;
}

async function removeAll(docIDs: string[]): Promise<void> {
    for (let i = 0; i < docIDs.length; i++) {
        let ok = await removeDocument(docIDs[i]);
        if (!ok)         console.error(`Even deleting document with id ${docIDs[i]} failed, wtf?`);
    }
}

async function processIt(): Promise<void> {
    await exifproc.open();

    let sourceDir = process.argv[2];
    if (!fs.existsSync(sourceDir))
        throw new Error("The directory does not exist");

    let filelist = getFileList(sourceDir);
    let dirname = path.basename(sourceDir);

    let thumbdir = path.join(CFG.exportThumbPath, dirname);

    if (!fs.existsSync(thumbdir))
        fs.mkdirSync(thumbdir, { recursive: true });

    let docs: API.Photo[] = []; // let first create array and then slowly feed the server (for the case not everything goes well)

    for (let i = 0; i < filelist.length; i++) {
        let cfile = path.join(sourceDir, filelist[i]);
        let type = decidePhotoFormat(cfile);

        console.log(`Processing ${filelist[i]} from ${dirname}, type ${type}`);

        if (type == API.PhotoType.oth) {
            console.log(`${filelist[i]}: not processing`);
            continue;
        }

        let date = await readExifDate(cfile);
        let thumbfile = await createThumbFile(type, cfile, thumbdir);

        docs.push({
            comment: "",
            tags: {},
            date: date,
            folder: dirname,
            original: filelist[i],
            source: decidePhotoSource(dirname, filelist[i]),
            thumb: thumbfile,
            type: type
        });
    }

    console.log("So far so good, everything went well (probably), let's feed the server");
    console.log("--------------------------------------------");

    let inserted: string[] = [];

    for (let i = 0; i < docs.length; i++) {
        console.log(`Uploading ${docs[i].folder}/${docs[i].original} metadata`);
        let id = await uploadDocument(docs[i]);

        if (id) {
            inserted.push(id);
            console.log("    ok");
        } else {
            console.error(`    Uploading failed, going to delete all previous`);
            await removeAll(inserted);
            break;
        }
    }
}

let user = process.env.VR_USER;
let pass = process.env.VR_PASS;

console.log(`Trying to log '${user}' with password ${pass ? "not null" : "empty"}`);

login(user, pass)
.then( (res) => {
    return processIt();
})
.catch((reas) => {
    console.error("Catched error!");

    console.error(reas);
    exifproc.close();
}).then(() => {
    exifproc.close();
});
