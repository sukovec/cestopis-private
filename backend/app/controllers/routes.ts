import { controller, httpGet, requestBody, httpPost } from 'inversify-express-utils';
import { inject } from "inversify"
import TYPES from "../const/types";
import db from "../services/db";

import * as API from "../common/ifaces";
import fetch from "node-fetch";

@controller('/api/routes', TYPES.NeedLogin)
export class RouteController {
	constructor(@inject(TYPES.database) private database: db) {

	}

	@httpPost("/routeBetween") 
	public getRoute(@requestBody() body: API.APIRequestRoute): Promise<API.APIResponse<API.RespRoute>> {
		let crdS = `${body.from.latlng.lng},${body.from.latlng.lat}`;
		let crdE = `${body.to.latlng.lng},${body.to.latlng.lat}`;

		return fetch(`http://router.project-osrm.org/route/v1/driving/${crdS};${crdE}?geometries=geojson&overview=full`).then( (res) => {
			return res.json();
		}).then( (res: any) => {
			if (res.code != "Ok") return Promise.reject("A route API returned non-OK code");

			let coords: API.LatLng[] = res.routes[0].geometry.coordinates.map((itm: any) => {return {lat: itm[1], lng: itm[0]}});

			let ret: API.APIResponse<API.RespRoute> = {
				result: API.APIResponseResult.OK,
				data: coords
			};

			return ret;
		}); /*.catch( (err: any) => {
			return {
				result: API.APIResponseResult.Fail
			}
		});*/
		
		/*/return /*new Promise( (res, rej) => {
			res([body.from, body.to]);
		});*/
	}

	@httpGet("/route")
	public getRouteList(): Promise<any[]> { // TODO: make a interface
		return new Promise( (res, rej) => {
			this.database.routes.find({}, (err: any, docs: any[]) => {
				if (err) return rej(err);
				res(docs.map((v,i,a) => { 
					return v; // TODO: return ID + basic info
				}));
			})
		});
	}

	@httpPost("/route")
	public createNewRoute(@requestBody() body: any): Promise<API.APIResponse<API.RespID>> {
		return new Promise( (res, rej) => {
			this.database.routes.insert(body, (err, doc) => {
				if (err) return rej(err);

				let resp: API.APIResponse<API.RespID> = {
					result: API.APIResponseResult.OK,
					data: doc._id
				};

				res(resp);
			});
		});
	}
}
