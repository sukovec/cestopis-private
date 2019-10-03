import { controller, httpGet, response, requestBody, httpPost, requestParam } from 'inversify-express-utils';
import { inject } from "inversify";
import * as express from "express";
import * as path from "path";

import CFG from "../const/config";
import TYPES from "../const/types";
import db from "../sup/db";

import * as API from "../common/ifaces";

@controller('/api/photos')
export class PhotosController {
	constructor(@inject(TYPES.database) private database: db) {

	}

	@httpGet("/dirs")
	public getRouteList(): Promise<API.APIResponse<API.RespPhotoDirlist>> { // TODO: make a interface
		return new Promise( (res, rej) => {
            this.database.photos.find({}, {"folder": 1}, (err: any, docs: any[]) => {
                if (err) return rej(err);

                let retdata = Object.keys(docs
                    .map(v => v.folder)
                    .reduce((prev, cur) => {
                        prev[cur] = true;
                        return prev;
                    }, {}));

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
        return new Promise( (res, rej) => {
            let search = {};
            if (dir !== null) search = { folder: dir };

            this.database.photos.find(search, {_id: 1}, (err, docs: any[]) => {
                if (err) return rej(err);

                let ret: API.APIResponse<API.RespPhotoList> = {
                    result: API.APIResponseResult.OK,
                    data: docs.map(itm => itm._id)
                };

                res(ret);
            });
        });
    }

    @httpGet("/photo/:id/:type")
    public getActualPhoto(@requestParam("id") id: string, @requestParam("type") type: string, @response() resp: express.Response) {
        return new Promise( (res, rej) => {
            this.database.photos.findOne({_id: id}, (err, docum: any) => {
                if (err) rej(err);

                switch(type) {
                    case "thumb":
                        let file = path.join(CFG.thumbPath, docum.folder, docum.thumb);
                        return resp.sendFile(file);
                    case "info":
                        let ret: API.APIResponse<API.Photo> = {
                            result: API.APIResponseResult.OK,
                            data: docum
                        };

                        res(ret);
                }
            });
        });
    }
    /***************
    ///// TAGS /////
    ***************/
   @httpGet("/tags")
   public getTagList(): Promise<API.APIResponse<API.RespTagList>> {
       return new Promise( (res, rej) => {
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
