import { controller, httpGet, response, requestBody, httpPost, requestParam } from 'inversify-express-utils';
import { inject } from "inversify";
import * as express from "express";
import * as path from "path";

import CFG from "../const/config";
import TYPES from "../const/types";
import db from "../sup/db";

import * as API from "../common/ifaces";

// lot of code in PhotosController MUST be rewritten to some singleton service!
@controller('/api/photos')
export class PhotosController {
    private idTagPlace = "xyz";
    constructor(@inject(TYPES.database) private database: db) {
        database.phtags.findOne({tagName: "place"}, {_id: 1}, (err, doc: any) => {
            if (err) {
                console.error("Cannot find id of photo-tag 'place'");
                return;
            }
            console.log("Found id of 'place' tag");
            this.idTagPlace = doc._id;
        });
    }

    @httpGet("/dirs")
    public getPhotoDirlist(): Promise<API.APIResponse<API.RespPhotoDirlist>> { // TODO: make a interface
        return new Promise((res, rej) => {
            this.database.photos.find({}, (err: any, docs: API.Photo[]) => {
                if (err) return rej(err);

                let prepdata = docs.reduce( (retobj: any, cur: API.Photo) => {
                    if (retobj[cur.folder] == undefined)
                        retobj[cur.folder] = { dirName: cur.folder, photos: 0, untagged: 0, places: new Set()};

                    retobj[cur.folder].photos++;
                    if (Object.keys(cur.tags).length == 0)
                        retobj[cur.folder].untagged++;
                    
                    if (cur.tags[this.idTagPlace])
                        retobj[cur.folder].places.add(cur.tags[this.idTagPlace].subtag);

                    return retobj;
                }, {});

                let retdata: API.DirectoryStats[] = Object.keys(prepdata).map( (itm) => {
                    let ret = prepdata[itm];
                    ret.places = Array.from(ret.places);
                    return ret;
                });

                res(
                    {
                        result: API.APIResponseResult.OK,
                        data: retdata
                    });
            });
        });
    }

    @httpGet("/photos")
    public getAllPhotos(@requestParam("dir") dir: string): Promise<API.APIResponse<API.RespPhotoList>> {
        return this.getPhotoList(null);
    }

    @httpGet("/photos/:dir")
    public getPhotoList(@requestParam("dir") dir: string): Promise<API.APIResponse<API.RespPhotoList>> {
        return new Promise((res, rej) => {
            let search = {};
            if (dir !== null) search = { folder: dir };

            this.database.photos.find(search, { _id: 1 }).sort({date: 1}).exec( (err, docs: any[]) => {
                if (err) return rej(err);

                let ret: API.APIResponse<API.RespPhotoList> = {
                    result: API.APIResponseResult.OK,
                    data: docs.map(itm => itm._id)
                };

                res(ret);
            });
        });
    }

    // Getting something about photo with actual ID:

    private getPhotoById(id: string): Promise<API.Photo> {
        return new Promise((res, rej) => {
            this.database.photos.findOne({ _id: id }, (err: any, docum: any) => {
                if (err) rej(err);
                else res(docum);
            });
        });
    }

    private getPreviousPhoto(date: number, folder: string): Promise<API.Photo> {
        return new Promise((res, rej) => {
            this.database.photos.find({ folder: folder, date: { $lt: date } }).sort({ date: -1 }).limit(1).exec((err: any, docum: any) => {
                if (err) rej(err);
                else res(docum[0]);
            });
        });
    }

    private getNextPhoto(date: number, folder: string): Promise<API.Photo> {
        return new Promise((res, rej) => {
            this.database.photos.find({ folder: folder, date: { $gt: date } }).sort({ date: 1 }).limit(1).exec((err: any, docum: any) => {
                if (err) rej(err);
                else res(docum[0]);
            });
        });
    }

    @httpGet("/photo/:id/thumb")
    public async getThumb(@requestParam("id") id: string, @response() resp: express.Response) {
        this.database.photos.findOne({ _id: id }, (err, doc) => {
            if (err || !doc) {
                return { result: API.APIResponseResult.Fail, resultDetail: "ERR404: Not found", data: undefined };
            }

            let file = path.join(CFG.thumbPath, doc.folder, doc.thumb);
            resp.sendFile(file);
        }); 

        return new Promise( (res, rej) => {});
    }

    @httpPost("/photo/:id/info")
    public updatePhotoMetadata(@requestParam("id") id: string, @requestBody() body: any ): Promise<API.APIResponse<void>> { // TODO: make a interface for update
        return new Promise( (res, rej) => {
            this.database.photos.update(
                {_id: id}, 
                {
                    $set: {
                        comment: body.comment,
                        tags: body.tags
                    }
                },
                {}, 
                (err, numAffected) => {
                    if (err) rej(err);
                    
                    res(
                        {
                            result: numAffected == 0 ? API.APIResponseResult.Fail : API.APIResponseResult.OK,
                            resultDetail: numAffected == 0 ? "Somehow, nothing have changed" : undefined,
                            data: undefined
                        }
                    )
                });
        });
    }

    @httpGet("/photo/:id/info")
    public getPhotoMetadata(@requestParam("id") id: string) {
        return this.getPhotoById(id).then((doc) => {
            let ret: API.APIResponse<API.RespPhotoInfo> = {
                result: API.APIResponseResult.OK,
                data: doc
            };
            return ret;
        });
    }

    @httpGet("/photo/:id/around")
    public async getActualPhoto(@requestParam("id") id: string, @response() resp: express.Response): Promise<API.APIResponse<API.PhotoAround>> {
        let photo = await this.getPhotoById(id);
        if (!photo) {
            let ret: API.APIResponse<API.PhotoAround> = {
                result: API.APIResponseResult.Fail,
                resultDetail: "ERR404: Not found",
                data: undefined
            };
            return ret;
        }

        let docPrev = await this.getPreviousPhoto(photo.date, photo.folder);
        let docNext = await this.getNextPhoto(photo.date, photo.folder);

        let prev = undefined;
        let next = undefined;

        if (docPrev) 
            prev = docPrev._id;

        if (docNext)
            next = docNext._id;
        

        let ret: API.APIResponse<API.PhotoAround> = {
            result: API.APIResponseResult.OK,
            data: {
                prev: prev,
                next: next
            }
        };
        return ret;
    }

    /***************
    ///// TAGS /////
    ***************/
    @httpGet("/tags")
    public getTagList(): Promise<API.APIResponse<API.RespTagList>> {
        return new Promise((res, rej) => {
            this.database.phtags.find({}, (err: any, doc: API.PhotoTag[]) => {
                if (err) return rej(err);

                let ret: API.APIResponse<API.RespTagList> = {
                    result: API.APIResponseResult.OK,
                    data: doc
                };
                res(ret);
            })
        })
    }


}
