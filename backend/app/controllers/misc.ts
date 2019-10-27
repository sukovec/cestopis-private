import { controller, httpGet, requestBody, httpPatch } from 'inversify-express-utils';
import { inject } from "inversify";

import TYPES from "../const/types";

import * as API from "../api/main";
import MiscService from "../services/misc";

@controller('/api/misc', TYPES.NeedLogin)
export class MiscController {
    constructor(@inject(TYPES.MiscService) private misc: MiscService) {

    }

    @httpGet("/config")
    public getConfig(): Promise<API.APIResponse<API.RespConfiguration>> {
        return this.misc.getConfiguration()
        .then( (cfg) => {
            return {
                result: API.APIResponseResult.OK,
                data: cfg
            }
        })
        .catch ( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }

    @httpPatch("/config")
    public updateConfig(@requestBody() body: API.Configuration): Promise<API.APIResponse<void>> {
        return this.misc.setConfiguration(body)
        .then( () => {
            return {
                result: API.APIResponseResult.OK,
                data: null
            }
        })
        .catch ( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }
}
