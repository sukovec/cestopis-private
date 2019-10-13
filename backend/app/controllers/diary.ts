import { controller, httpGet, httpPatch, requestBody, httpPost, httpDelete, requestParam } from 'inversify-express-utils';
import { inject } from "inversify";

import TYPES from "../const/types";
import ServiceDiary from "../services/serviceDiary";

import * as API from "../common/ifaces";

@controller('/api/diary')
export class DiaryController {
    constructor(@inject(TYPES.DiaryService) private drsr: ServiceDiary) {

    }

    @httpGet("/")
    public getPostList(): Promise<API.APIResponse<API.RespPostList>> {
        return this.drsr.getAllPosts()
        .then( (res) => {
            return {
                result: API.APIResponseResult.OK,
                data: res
            };
        })
        .catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            };
        });
    }

    @httpGet("/:id")
    public getAPost(@requestParam("id") id: string): Promise<API.APIResponse<API.RespPost>> {
        return this.drsr.getPostById(id)
        .then( (res) => {
            return {
                result: API.APIResponseResult.OK,
                data: res
            };
        })
        .catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            };
        });
    }

    @httpPost("/")
    public uploadPost(@requestBody() body: API.Post): Promise<API.APIResponse<API.RespID>> {
        return this.drsr.createNewPost(body)
        .then( (res) => {
            return {
                result: API.APIResponseResult.OK,
                data: res
            };
        })
        .catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            };
        });
    };

    @httpPatch("/:postId")
    public updatePost(@requestBody() body: API.Post, @requestParam("postId") postId: string): Promise<API.APIResponse<void>> {
        return this.drsr.updatePost(postId, body).then( (ret) => {
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
}