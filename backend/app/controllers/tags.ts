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
import PhotoService from "../services/srvphotos";

import * as API from "../api/main";
import TagService from '../services/tagService';

@controller('/api/tags', TYPES.NeedLogin)
export class TagsController {
    constructor(@inject(TYPES.TagService) private tagsrv: TagService) {

    }

    @httpGet("/dirs")
    public getTagList(): Promise<API.APIResponse<API.RespTagList>> {
        return this.tagsrv.getTagList()
            .then((list) => {
                return {
                    result: API.APIResponseResult.OK,
                    data: list
                };
            });
    }
}