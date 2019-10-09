import { controller, httpGet, response, requestBody, httpPost, httpDelete, requestParam } from 'inversify-express-utils';
import { inject } from "inversify";
import * as express from "express";
import * as path from "path";

import TYPES from "../const/types";
import ServiceDiary from "../services/serviceDiary";

import * as API from "../common/ifaces";

// lot of code in PhotosController MUST be rewritten to some singleton service!
@controller('/api/diary')
export class DiaryController {
    constructor(@inject(TYPES.DiaryService) private photosrv: ServiceDiary) {

    }

    @httpGet("/")
    public getDayList(): void {

    }
}