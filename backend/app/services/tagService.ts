import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../common/ifaces";

let provideSingleton = function (identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.PhotoService)
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
}