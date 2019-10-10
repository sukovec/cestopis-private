import { controller, httpGet, response, requestBody, httpPost, httpDelete, requestParam } from 'inversify-express-utils';
import { inject } from "inversify";

import TYPES from "../const/types";
import ServiceDiary from "../services/serviceDiary";

import * as API from "../common/ifaces";

@controller('/api/diary')
export class DiaryController {
    constructor(@inject(TYPES.DiaryService) private photosrv: ServiceDiary) {

    }

    @httpGet("/")
    public getPostList(): void {

    }
}