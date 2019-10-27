import { controller, httpGet, requestBody, httpPost, httpPatch, requestParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";

import TYPES from "../const/types";
import ServiceWriters from "../services/serviceWriters";

import * as API from "../api/main";

@controller(API.Urls.Writers.r(), TYPES.NeedLogin)
export class WritersController {
    constructor(@inject(TYPES.WritersService) private wrtsrv: ServiceWriters) {

    }

    @httpGet(API.Urls.Writers.listall)
    public getWritersList(): Promise<API.APIResponse<API.RespWriterList>> {
        return this.wrtsrv.getWritersList().then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: ret
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }

    @httpGet(API.Urls.Writers.actual)
    public getWriterById(@requestParam("writerId") id: string): Promise<API.APIResponse<API.RespWriter>> {
        return this.wrtsrv.getWriterById(id).then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: ret
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }

    @httpPatch(API.Urls.Writers.actual)
    public updateWriter(@requestParam("writerId") id: string, @requestBody() body: API.Writer): Promise<API.APIResponse<API.RespWriter>> {
        return this.wrtsrv.updateWriter(id, body).then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: null
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }

    @httpDelete(API.Urls.Writers.actual)
    public deleteWriter(@requestParam("writerId") id: string): Promise<API.APIResponse<API.RespWriter>> {
        return this.wrtsrv.removeWriter(id).then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: null
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }

    @httpPost(API.Urls.Writers.listall)
    public createNewWriter(@requestBody() body: API.Writer): Promise<API.APIResponse<API.RespID>> {
        return this.wrtsrv.addNewWriter(body).then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: ret
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }
}