import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../api/main";

let provideSingleton = function (identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.PhotoService)
export default class PhotoService {
    private idTagPlace = "xyz";
    constructor(@inject(TYPES.database) private database: db) {
        database.phtags.findOne({ tagName: "place" }, { _id: 1 }, (err, doc: any) => {
            if (err) {
                console.error("ERROR: Finding photo-tag 'place' raised an error");
                console.error(err);
                return;
            }

            if (!doc) {
                console.warn("Warning: not found tag 'place'");
                return;
            }

            console.log("Found id of 'place' tag");
            this.idTagPlace = doc._id;
        });
    }

    public getPhotoDirlist(): Promise<API.RespPhotoDirlist> {
        return new Promise((res, rej) => {
            this.database.photos.find({}, (err: any, docs: API.Photo[]) => {
                if (err) return rej(err);

                let prepdata = docs.reduce((retobj: any, cur: API.Photo) => {
                    if (retobj[cur.folder] == undefined)
                        retobj[cur.folder] = { dirName: cur.folder, photos: 0, untagged: 0, places: new Set(), sources: new Set() };

                    retobj[cur.folder].photos++;
                    if (Object.keys(cur.tags).length == 0)
                        retobj[cur.folder].untagged++;

                    if (cur.tags[this.idTagPlace])
                        retobj[cur.folder].places.add(cur.tags[this.idTagPlace].subtag);

                    retobj[cur.folder].sources.add(cur.source);

                    return retobj;
                }, {});

                res(Object.keys(prepdata).map((itm) => {
                    let ret = prepdata[itm];
                    ret.places = Array.from(ret.places);
                    ret.sources = Array.from(ret.sources);
                    return ret;
                }));
            });
        });
    }

    public getPhotoList(dir?: string): Promise<API.Photo[]> {
        return new Promise((res, rej) => {
            let search = {};
            if (dir !== null) search = { folder: dir };

            this.database.photos.find(search, { _id: 1 }).sort({ date: 1 }).exec((err, docs: any[]) => {
                if (err) return rej(err);

                res(docs);
            });
        });
    }

    public getPhotoById(id: string): Promise<API.Photo> {
        return new Promise((res, rej) => {
            this.database.photos.findOne({ _id: id }, (err: any, docum: any) => {
                if (err) rej(err);

                else res(docum);
            });
        });
    }

    public updatePhotoMetadata(id: string, body: API.Photo): Promise<void> {
        return new Promise((res, rej) => {
            this.database.photos.update(
                { _id: id },
                {
                    $set: {
                        comment: body.comment,
                        tags: body.tags
                    }
                },
                {},
                (err, numAffected) => {
                    if (err) rej(err);
                    if (numAffected != 1) rej(new Error(`Update was not successfull (numAffected was ${numAffected}`));

                    res();
                });
        });
    }

    private makeModifierObject(prefix: string, set: { [key: string]: any }) {
        let retObj: any = {};
        Object.keys(set)
            .filter(itm => set.hasOwnProperty(itm))
            .forEach((itm) => {
                retObj[prefix + itm] = set[itm];
            });

        return retObj;
    }

    public updatePhotoTags(id: string, add: API.PhotoTagset, remove: API.PhotoTagset, change: API.PhotoTagset): Promise<void> {
        let rquest: any = {};
        if (add) {
            rquest.$set = this.makeModifierObject("tags.", add);
        }

        if (remove) {
            rquest.$unset = this.makeModifierObject("tags.", remove);
        }

        // probably mere add and change right in the request
        if (change) {
            if (!rquest.$set) rquest.$set = {};
            Object.assign(rquest.$set, this.makeModifierObject("tags.", change));
        }

        return new Promise((res, rej) => {
            this.database.photos.update({ _id: id }, rquest, {}, (err, nou) => {
                if (err) return rej(err);
                if (nou != 1) return rej(new Error("No document was updated"));
                res();
            });
        });
    }

    public getPreviousPhoto(date: number, folder: string): Promise<API.Photo> {
        return new Promise((res, rej) => {
            this.database.photos.find({ folder: folder, date: { $lt: date } }).sort({ date: -1 }).limit(1).exec((err: any, docum: any) => {
                if (err) rej(err);
                else res(docum[0]);
            });
        });
    }

    public getNextPhoto(date: number, folder: string): Promise<API.Photo> {
        return new Promise((res, rej) => {
            this.database.photos.find({ folder: folder, date: { $gt: date } }).sort({ date: 1 }).limit(1).exec((err: any, docum: any) => {
                if (err) rej(err);
                else res(docum[0]);
            });
        });
    }

    public addPhotoDoc(doc: API.Photo): Promise<string> {
        return new Promise((res, rej) => {
            this.database.photos.insert(doc, (err, doc) => {
                if (err) return rej(err);

                res(doc._id);
            });
        });
    }

    public removePhotoDoc(id: string): Promise<boolean> {
        return new Promise((res, rej) => {
            this.database.photos.remove({ _id: id }, (err, num) => {
                if (err) return rej(err);

                res(num == 1);
            });
        });
    }
}
