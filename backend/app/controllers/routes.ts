import { controller, httpGet, requestBody, httpPost } from 'inversify-express-utils';
import { inject } from "inversify"
import TYPES from "../const/types";

import * as API from "../api/main";
import fetch from "node-fetch";

import RouteService from "../services/routeService";

@controller(API.Urls.Routes.r(), TYPES.NeedLogin)
export class RouteController {
	constructor(@inject(TYPES.RouteService) private routsrv: RouteService) {

	}

	@httpPost(API.Urls.Routes.between)
	public routeBetween(@requestBody() body: API.APIRequestRoute): Promise<API.APIResponse<API.RespRoutePoints>> {
		return this.routsrv.getRouteBetween(body.from.latlng, body.to.latlng)
			.then((res) => {
				return {
					result: API.APIResponseResult.OK,
					data: res
				};
			});
	}

	@httpGet(API.Urls.Routes.all)
	public getRouteList(): Promise<API.APIResponse<API.RespRouteList>> {
		return this.routsrv.getSavedRoutesList()
		.then ((res) => {
			return {
				result: API.APIResponseResult.OK,
				data: res
			};
		});
	}

	@httpPost(API.Urls.Routes.all)
	public createNewRoute(@requestBody() body: any): Promise<API.APIResponse<API.RespID>> {
		return this.routsrv.createNewRoute(body)
			.then((res) => {
				return {
					result: API.APIResponseResult.OK,
					data: res
				};
			});
	}
}
