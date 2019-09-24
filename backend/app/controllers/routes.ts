import { controller, httpGet, requestBody, httpPost } from 'inversify-express-utils';
import { inject } from "inversify"
import TYPES from "../const/types";
import db from "../sup/db";

@controller('/api/routes')
export class RouteController {
	constructor(@inject(TYPES.database) private database: db) {

	}

	@httpPost("/routeBetween") 
	public getRoute(@requestBody() body: any): Promise<any> {
		return new Promise( (res, rej) => {
			res([body.from, body.to]);
		});
	}
}
