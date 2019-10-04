import * as API from "../app/common/ifaces";
import db from "../app/services/db";

import * as fs from "fs";
import "reflect-metadata";


let dbase = new db();

let fileTags = fs.readFileSync("/home/suk/code/php-photo-tagger/tags.txt", {encoding: "utf8"} );
let fileKeys = fs.readFileSync("/home/suk/code/php-photo-tagger/tagkeys.txt", {encoding: "utf8"} );
let fileTrans = fs.readFileSync("/home/suk/code/php-photo-tagger/tagtranslate.translate", {encoding: "utf8"} );

let taglines = fileTags.toString().split("\n");
let keylines = fileKeys.toString().split("\n");
let translines = fileTrans.toString().split("\n");

let keymap: { [key: string]: string} = {};
let translations: { [key: string]: string } = {};

keylines.forEach( (keyline: string) => {
    if (keyline == "") return;

    let duo = keyline.split(" ");
    keymap[duo[1]] = duo[0];
});

translines.forEach( (transline: string) => {
    if (transline == "") return;

    let duo = transline.split("=");
    translations[duo[0]] = duo[1];
});


taglines.forEach( (itm: string) => {
    if (itm == "")
        return;

    let hidden = false;
    let subtags: API.PhotoSubTag[] = [];
    let name = "";
    let translation = "";

    if (itm[0] == "!") {
        hidden = true;
        itm = itm.substring(1);
    }
    
    let spl = itm.split(":");
    console.assert(spl.length == 1 || spl.length == 2, "WTF 01");

    name = spl[0];
    if (spl.length == 2) {
        let subs = spl[1].split(",");
        subs.forEach( (itm) => {
            if (itm == "") return;
            subtags.push({tagName: itm, translation: translations[`${name}___${itm}`]});
        })
    }

    let insert: API.PhotoTag = {
        hidden: hidden,
        subtags: subtags,
        tagName: name,
        tagKey: keymap[name],
        translation: translations[name]
    };

    dbase.phtags.insert(insert, (err, doc) => {
        console.assert(err == null, "Insert failed");

        console.log(`ID: ${doc._id}, tagName: ${doc.tagName}`);
    });
});