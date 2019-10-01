import { controller, httpGet, requestBody, httpPost } from 'inversify-express-utils';
import { inject } from "inversify"
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

}
