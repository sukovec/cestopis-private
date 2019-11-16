import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../api/main";

let provideSingleton = function (identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.TagService)
export default class TagService {
    constructor(@inject(TYPES.database) private database: db) {

    }

    getTagList(): Promise<API.PhotoTag[]> {
        return new Promise((res, rej) => {
            this.database.phtags.find({}, (err: any, doc: API.PhotoTag[]) => {
                if (err) return rej(err);

                res(doc);
            })
        })
    }

    getTagById(idTag: string): Promise<API.PhotoTag> {
        return new Promise( (res, rej) => {
            this.database.phtags.findOne({_id: idTag}, (err: any, doc: API.PhotoTag) => {
                if (err) return rej(err);

                res(doc);
            })
        });
    }

    getTagByName(name: string): Promise<API.PhotoTag> {
        return new Promise( (res, rej) => {
            this.database.phtags.findOne({tagName: name}, (err: any, doc: API.PhotoTag) => {
                if (err) return rej(err);

                res(doc);
            })
        });
    }

    addNewTag(tag: API.PhotoTag): Promise<string> {
        return new Promise( (res, rej) => {
            this.database.phtags.insert(tag, (err, doc) => {
                if (err) return rej (err);

                res(doc._id);
            });
        }); 
    }

    updateTag(tagId: string, tag: API.PhotoTag): Promise<void> {
        return new Promise( (res, rej) => {
            this.database.phtags.update({_id: tagId}, tag, {}, (err, num) => {
                if (err) return rej (err);
                if (num != 1) throw new Error("No document was updated");

                res();
            });
        }); 
    }
}