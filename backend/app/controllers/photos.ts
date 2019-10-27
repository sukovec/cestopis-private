import {
    controller,
    response,
    requestBody,
    requestParam,
    queryParam,
    httpGet,
    httpPost,
    httpDelete,
    httpPatch,
} from 'inversify-express-utils';
import { inject } from "inversify";
import * as express from "express";
import * as path from "path";

import CFG from "../const/config";
import TYPES from "../const/types";
import PhotoService from "../services/srvphotos";

import * as API from "../api/main";

@controller(API.Urls.Photos.r(), TYPES.NeedLogin)
export class PhotosController {
    constructor(@inject(TYPES.PhotoService) private photosrv: PhotoService) {

    }

    @httpGet(API.Urls.Photos.dirlist)
    public async getPhotoDirlist(): Promise<API.APIResponse<API.RespPhotoDirlist>> {
        let data = await this.photosrv.getPhotoDirlist();
        data.sort((a, b) => { return (a.dirName > b.dirName) ? 1 : -1 });
        return {
            result: API.APIResponseResult.OK,
            data: data
        };
    }

    @httpGet(API.Urls.Photos.photosdir)
    public getPhotoList(@requestParam("dir") dir: string, @queryParam("full") full: boolean): Promise<API.APIResponse<API.RespPhotoList>> {
        return this.photosrv.getPhotoList(dir)
            .then((ret) => {
                return {
                    result: API.APIResponseResult.OK,
                    data: full ? ret : ret.map(itm => itm._id)
                }
            });
    }

    @httpGet(API.Urls.Photos.allphotos)
    public getAllPhotos(): Promise<API.APIResponse<API.RespPhotoList>> {
        return this.photosrv.getPhotoList()
            .then((ret) => {
                return {
                    result: API.APIResponseResult.OK,
                    data: ret.map(itm => itm._id)
                }
            });
    }

    @httpGet(API.Urls.Photos.metadata)
    public getPhotoMetadata(@requestParam("id") id: string): Promise<API.APIResponse<API.RespPhotoInfo>> {
        return this.photosrv.getPhotoById(id)
        .then( (itm) => {
            return  {
                result: API.APIResponseResult.OK,
                data: itm
            };
        });
    }

    @httpGet(API.Urls.Photos.thumbnail)
    public async getThumb(@requestParam("id") id: string, @response() resp: express.Response) {
        this.photosrv.getPhotoById(id)
            .then((itm) => {
                let file = path.join(CFG.thumbPath, itm.folder, itm.thumb);
                resp.sendFile(file);
            });
        return new Promise((res, rej) => {});
    }

    @httpGet(API.Urls.Photos.original)
    public async getOriginal(@requestParam("id") id: string, @response() resp: express.Response) {
        this.photosrv.getPhotoById(id)
            .then((itm) => {
                let file = path.join(CFG.thumbPath, itm.folder, itm.original);
                resp.sendFile(file);
            });
    }

    @httpGet(API.Urls.Photos.around)
    public async getActualPhoto(@requestParam("id") id: string, @response() resp: express.Response): Promise<API.APIResponse<API.PhotoAround>> {
        return this.photosrv.getPhotoById(id)
        .then( (itm) => {
            return Promise.all([
                this.photosrv.getPreviousPhoto(itm.date, itm.folder),
                this.photosrv.getNextPhoto(itm.date, itm.folder)
            ])
        })
        .then( (itms) => {
            return {
                result: API.APIResponseResult.OK,
                data: {
                    prev: itms[0] ? itms[0]._id : undefined,
                    next: itms[1] ? itms[1]._id : undefined,
                }
            }
        });
    }


    @httpPatch(API.Urls.Photos.metadata)
    public updatePhotoMetadata(@requestParam("id") id: string, @requestBody() body: any): Promise<API.APIResponse<void>> { // TODO: make a interface for update
        return this.photosrv.updatePhotoMetadata(id, body)
        .then ( () => {
            return {
                result: API.APIResponseResult.OK,
                data: undefined
            };
        });
    }

    @httpPatch(API.Urls.Photos.multitag)
    public async multitag(): Promise<API.APIResponse<void>> {
        return {
            result: API.APIResponseResult.OK,
            data: null
        };
    }

    // ADMIN-LOCALHOST ONLY ENDPOINTS
    // only for localhost


    @httpPost(API.Urls.Photos.allphotos, TYPES.NeedAdmin)
    public addNewPhoto(@requestBody() body: API.Photo): Promise<API.APIResponse<API.RespID>> {
        return this.photosrv.addPhotoDoc(body)
            .then((id: string) => {
                return {
                    result: API.APIResponseResult.OK,
                    data: id
                };
            })
            .catch((err) => {
                return {
                    result: API.APIResponseResult.Fail,
                    resultDetail: err,
                    data: undefined
                };
            });
    }

    @httpDelete(API.Urls.Photos.photo, TYPES.NeedAdmin)
    public removePhoto(@requestParam("id") id: string): Promise<API.APIResponse<void>> {
        return this.photosrv.removePhotoDoc(id)
            .then((okej: boolean) => {
                return {
                    result: okej ? API.APIResponseResult.OK : API.APIResponseResult.Fail,
                    data: undefined
                };
            })
            .catch((err) => {
                return {
                    result: API.APIResponseResult.Fail,
                    resultDetail: err,
                    data: undefined
                };
            });
    }

}
