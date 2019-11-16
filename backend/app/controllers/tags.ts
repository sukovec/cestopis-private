import {
    controller,
    response,
    requestBody,
    requestParam,
    httpGet,
    httpPost,
    httpDelete,
    httpPatch,
} from 'inversify-express-utils';
import { inject } from "inversify";
import TYPES from "../const/types";

import * as API from "../api/main";
import TagService from '../services/tagService';

@controller(API.Urls.Tags.r(), TYPES.NeedLogin)
export class TagsController {
    constructor(@inject(TYPES.TagService) private tagsrv: TagService) {

    }

    @httpGet(API.Urls.Tags.taglist)
    public getTagList(): Promise<API.APIResponse<API.RespTagList>> {
        return this.tagsrv.getTagList()
            .then((list) => {
                return {
                    result: API.APIResponseResult.OK,
                    data: list
                };
            });
    }

    @httpPost(API.Urls.Tags.taglist)
    public postNewTag(@requestBody() body: API.PhotoTag): Promise<API.APIResponse<API.RespID>> {
        return this.tagsrv.addNewTag(body)
            .then( (id) => {
                return {
                    result: API.APIResponseResult.OK,
                    data: id
                }
            });
    }

    @httpGet(API.Urls.Tags.specific)
    public getSpecificTag(@requestParam("idTag") idTag: string): Promise<API.APIResponse<API.RespTag>> {
        return this.tagsrv.getTagById(idTag)
        .then((tg) => {
            return {
                result: API.APIResponseResult.OK,
                data: tg
            };
        });
    }

    @httpPatch(API.Urls.Tags.specific)
    public updateTag(@requestParam("idTag") idTag: string, @requestBody() body: API.PhotoTag): Promise<API.APIResponse<void>> {
        return this.tagsrv.updateTag(idTag, body)
            .then( (id) => {
                return {
                    result: API.APIResponseResult.OK,
                    data: undefined
                }
            });
    }

}