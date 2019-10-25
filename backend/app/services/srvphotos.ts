import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../common/ifaces";

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.PhotoService)
export default class PhotoService { 
    private idTagPlace = "xyz";
    constructor(@inject(TYPES.database) private database: db) {
        database.phtags.findOne({tagName: "place"}, {_id: 1}, (err, doc: any) => {
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

                let prepdata = docs.reduce( (retobj: any, cur: API.Photo) => {
                    if (retobj[cur.folder] == undefined)
                        retobj[cur.folder] = { dirName: cur.folder, photos: 0, untagged: 0, places: new Set(), sources: new Set()};

                    retobj[cur.folder].photos++;
                    if (Object.keys(cur.tags).length == 0)
                        retobj[cur.folder].untagged++;
                    
                    if (cur.tags[this.idTagPlace])
                        retobj[cur.folder].places.add(cur.tags[this.idTagPlace].subtag);

                    retobj[cur.folder].sources.add(cur.source);
                    
                    return retobj;
                }, {});

                res(Object.keys(prepdata).map( (itm) => {
                    let ret = prepdata[itm];
                    ret.places = Array.from(ret.places);
                    ret.sources = Array.from(ret.sources);
                    return ret;
                }));
            });
        });
    }

    public addPhotoDoc(doc: API.Photo): Promise<string> {
        return new Promise( (res, rej) => {
            this.database.photos.insert(doc, (err, doc) => {
                if (err) return rej(err);

                res(doc._id);
            });
        });
    }

    public removePhotoDoc(id: string): Promise<boolean> {
        return new Promise( (res, rej) => {
            this.database.photos.remove({_id: id}, (err, num) => {
                if (err) return rej(err);

                res(num == 1);
            });
        });
    }
}
