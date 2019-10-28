import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../api/main";

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.RouteService)
export default class RouteService { 
    constructor(@inject(TYPES.database) private database: db) {
    }

    getRouteBetween(from: API.LatLng, to: API.LatLng): Promise<API.LatLng[]> {
        let crdS = `${from.lng},${from.lat}`;
		let crdE = `${to.lng},${to.lat}`;

		return fetch(`http://router.project-osrm.org/route/v1/driving/${crdS};${crdE}?geometries=geojson&overview=full`).then( (res) => {
			return res.json();
		}).then( (res: any) => {
			if (res.code != "Ok") return Promise.reject("A route API returned non-OK code");

			let coords: API.LatLng[] = res.routes[0].geometry.coordinates.map((itm: any) => {return {lat: itm[1], lng: itm[0]}});

            return coords;
		});
    }

    getSavedRoutesList(): Promise<API.SavedRouteDescription[]> {
        return new Promise((res, rej) => {
			this.database.routes.find({}, {routePoints: 0} as any, (err: any, docs: API.SavedRouteDescription[]) => {
				if (err) return rej(err);
				res(docs);
			})
		});
    }

    getSavedRoute(id: string): Promise<API.SavedRoute> {
        return new Promise((res, rej) => {
			this.database.routes.findOne({_id: id}, (err: any, doc: API.SavedRoute) => {
                if (err) return rej(err);
                if (!doc) return rej(new Error(`Route with id '${id}' was not found`));
				res(doc);
			})
		});
    }

    createNewRoute(route: API.SavedRoute): Promise<string> {
        return new Promise((res, rej) => {
			this.database.routes.insert(route, (err, doc) => {
				if (err) return rej(err);

				res(doc._id);
			});
		});
    }
}