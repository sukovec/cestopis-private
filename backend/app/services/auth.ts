import * as crypto from "crypto";
import { TextEncoder } from "util";
import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../common/ifaces";

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.AuthService)
export default class AuthService { 
    public constructor(@inject(TYPES.database) private dbase: db) {
    }

    public getUserByName(usr: string): Promise<API.User> {
        return new Promise( (res, rej) => {
            this.dbase.users.findOne({username: usr}, (err, doc: API.User) => {
                if (err) return rej(err);
                if (!doc) { 
                    return rej(new Error("Username not found")); 
                }

                res(doc);
            })
        });
    }

    public getRandomHexString(bytes: number): string {
        let retbytes = crypto.randomBytes(bytes);
        const retarr = Array.from(new Uint8Array(retbytes));
        return retarr.map(b => b.toString(16).padStart(2, '0')).join('');

    }

    public async authenticate(req: API.LoginRequest, chall: string): Promise<boolean> {
        let usr: API.User;
        try {
            usr = await this.getUserByName(req.user);
        }
        catch(exc) {
            console.warn(`Unsuccessfull login, user not found: '${req.user}'`);
            return false;
        }

        let tenc = new TextEncoder();
        let corstr = tenc.encode(chall + usr.pwhash); // challenge + stored password

        let hash = crypto.createHash("sha256")
        hash.update(corstr);
        let corrcthash = hash.digest();

        const corhash = Array.from(new Uint8Array(corrcthash));
        const corhex = corhash.map(b => b.toString(16).padStart(2, '0')).join('');
      
        let ret = corhex == req.passwd;
        if (!ret) 
            console.warn(`Unsuccessfull login, bad pasword for user '${req.user}'`);

        return ret;
    }
}