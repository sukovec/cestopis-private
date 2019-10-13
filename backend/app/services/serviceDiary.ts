import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../common/ifaces";

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.DiaryService)
export default class DiaryService { 
    constructor(@inject(TYPES.database) private database: db) {
    }

    public getAllPosts(): Promise<API.Post[]> {
        return new Promise( (res, rej) => {
            this.database.diary.find({}).sort({date: 1}).exec((err: any, doc: API.Post[]) => {
                if (err) return rej(err);

                res(doc);
            });
        });
    }

    public updatePost(postId: string, replace: API.Post): Promise<void> {
        return new Promise( (res, rej) => {
            this.database.diary.update({_id: postId}, replace, {}, (err: any, num: number) => {
                if (err) return rej(err);
                if (num == 0) rej("Nothing have been updated");
                if (num > 1) throw new Error("WritersService: WTF error");
                
                res();
            });
        }); 
    }

    public deletePost(postId: string): Promise<void> {
        return new Promise( (res, rej) => {
            this.database.diary.remove({_id: postId},{}, (err: any, num: number) => {
                if (err) return rej(err);
                if (num == 0) rej("Nothing have been deleted");
                if (num > 1) throw new Error("WritersService: WTF error");
                
                res();
            });
        }); 
    }


    public getPostById(id: string): Promise<API.Post> {
        return new Promise( (res, rej) => {
            this.database.diary.findOne({_id: id}, (err: any, doc: API.Post) => {
                if (err) return rej(err);
                if (!doc) return rej(`The post with id ${id} was not found`);
                res(doc);
            });
        });
    }

    public createNewPost(post: API.Post): Promise<string> {
        return new Promise( (res, rej) => {
            this.database.diary.insert(post, (err, doc: API.Post) => {
                if (err) return rej(err);

                res(doc._id);
            });
        });
    }

}