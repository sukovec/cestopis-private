import { controller, httpGet } from 'inversify-express-utils';
import * as nedb from "nedb";

@controller('/api/routes')
export class RouteController {
	constructor() {
		var doc = { "a": "b", 
			"c": "d"};
		let db = new nedb({filename: "/tmp/thefile.db", autoload: true});
		db.insert(doc, function(err, newdoc) {
			console.log(newdoc);
		});
	}

	@httpGet('/')
	public get(): string {
		return 'Home sweet home';
	}
}
