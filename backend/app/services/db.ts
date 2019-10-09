import * as Dataset from "nedb";
import TYPES from "../const/types"
import { fluentProvide } from "inversify-binding-decorators"
import CFG from "../const/config";

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.database)
export default class Database { 
	public readonly routes: Dataset;
	public readonly photos: Dataset;
	public readonly phtags: Dataset;
	public readonly diary: Dataset;
	public readonly writers: Dataset;

	constructor() {
		let path = CFG.databasePath;
		this.routes = new Dataset( {filename: `${path}/routes.ndb`, autoload: true });
		this.photos = new Dataset( {filename: `${path}/photos.ndb`, autoload: true });
		this.phtags = new Dataset( {filename: `${path}/phtags.ndb`, autoload: true });
		this.diary = new Dataset( {filename: `${path}/diary.ndb`, autoload: true });
		this.writers = new Dataset( {filename: `${path}/writers.ndb`, autoload: true });



		this.phtags.ensureIndex({fieldName: "tagName", unique: true}, (err) => {
			if (err != null) {
				console.warn("Index on phtags.tagName is not ensured!");
				console.error(err);
			}
		});
	}
}
