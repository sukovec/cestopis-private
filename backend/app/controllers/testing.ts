import { controller, httpGet, httpPatch, requestBody, httpPost, httpDelete, requestParam } from 'inversify-express-utils';
import { inject } from "inversify";

import TYPES from "../const/types";
import ServiceDiary from "../services/serviceDiary";

import * as API from "../common/ifaces";

@controller('/api/testing')
export class TestingController {
    constructor(@inject(TYPES.DiaryService) private drsr: ServiceDiary) {

    }

    @httpGet("/n-second-delay/:delay")
    twoSecondsDelay(@requestParam("delay") del: string): Promise<API.APIResponse<string>> {
        let delay = Number.parseInt(del) * 1000;
        return new Promise( (res, rej) => {
            setTimeout( () => {
                res({ 
                    result: API.APIResponseResult.OK,
                    data: "Two seconds have passed"
                }); }, delay);
        });
    }

    @httpGet("/two-second-delay-fail")
    twoSecondsFail(): Promise<API.APIResponse<string>> {
        return new Promise( (res, rej) => {
            setTimeout( () => {
                res({ 
                    result: API.APIResponseResult.Fail,
                    data: null
                }); }, 2000);
        });
    }

    @httpGet("/random-fail")
    randomFail(): Promise<API.APIResponse<string>> {
        let ret = Math.random() > 0.5 ? API.APIResponseResult.Fail : API.APIResponseResult.OK;
        return new Promise( (res, rej) => {
            setTimeout( () => {
                res({ 
                    result: ret,
                    data: "This is randomly failing function"
                }); }, 2000);
        });
    }
}