import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../common/ifaces";

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

enum MiscDocName {
    config = "configuration"
}

interface MiscDocument { 
    _id?: string; // neDB ID
    name: string; // the type of document
    content: any; /// content, neasi
}

// this should provide anything un-categorizable, right now, just a configuration
@provideSingleton(TYPES.MiscService)
export default class MiscService { 
    constructor(@inject(TYPES.database) private database: db) {
    }

    public getConfiguration(): Promise<API.Configuration> {
        return new Promise( (res, rej) => {
            this.database.misc.findOne({name: MiscDocName.config}, (err: any, doc: MiscDocument) => {
                if (err) return rej(err);

                if (!doc) return res({"firstDay": ""});    // return something like default and
                                                    // just create it on update

                res(doc.content);
            });
        });
    }

    public setConfiguration(config: API.Configuration): Promise<void> {
        let update = { $set: {content: config }};

        return new Promise( (res, rej) => {
            this.database.misc.update({name: MiscDocName.config}, update, {upsert: true}, (err: any, num: number) => {
                if (err) return rej(err);
                if (num == 0) throw new Error("MiscService: WTF error 1");
                if (num > 1) throw new Error("MiscService: WTF error 2");
                
                res();
            });
        }); 
    }
}