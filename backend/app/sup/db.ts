import * as Dataset from "nedb";
import TYPES from "../const/types"
import { fluentProvide } from "inversify-binding-decorators"

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.database)
export default class Database { 
	public readonly routes: Dataset;

	constructor() {
		this.routes = new Dataset("/home/suk/code/cestopis/data/routes.ndb");
	}
}
