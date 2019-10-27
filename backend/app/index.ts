import "reflect-metadata";

import * as express from "express";
import * as bodyParser from 'body-parser';
import * as path from "path";
import * as session from "express-session";
import * as uuid from "uuid/v4";
import * as prettyjson from "prettyjson";

import { Container } from "inversify";
import { InversifyExpressServer, getRouteInfo } from 'inversify-express-utils';
import { buildProviderModule } from "inversify-binding-decorators";


import CFG from "./const/config";
import * as API from "./common/ifaces";

// support
import "./services/db"
import "./services/srvphotos";
import "./services/tagService";
import "./services/serviceWriters";
import "./services/serviceDiary";
import "./services/user";
import "./services/misc";

// controllers:
import "./controllers/routes";
import "./controllers/photos";
import "./controllers/diary";
import "./controllers/writers";
import "./controllers/user";
import "./controller/tags";
import "./controllers/misc";

// middleware:
import "./middleware/needlogin";
import ErrorMW from "./middleware/errormw";

// set up session store
let sesstore = require('nedb-session-store')(session);

// set up container
let container = new Container();

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
	// add body parser
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(session({
		secret: CFG.sessionSecret,
		resave: false,
		saveUninitialized: false,
		store: new sesstore({ filename: `${CFG.databasePath}/session.ndb` }),
		genid: (req) => { return uuid() }
	}));
	app.use("/", express.static(path.resolve("../frontend/dist")));

	app.set("x-powered-by", false);
});

server.setErrorConfig((app) => {
	app.use((req, res, next) => {
		res.status(404);
		res.send({ result: API.APIResponseResult.Fail, resultDetail: "!notfound", });

		console.log(`ERROR 404: ${req.url}`);
	});
	app.use(ErrorMW);
});

container.load(buildProviderModule())

let app = server.build();
app.listen(CFG.serverPort, CFG.serverListen);
console.log(`Running on http://${CFG.serverListen}:${CFG.serverPort}/`);
console.log("Static from: ", path.resolve("../frontend/dist"));
const routeInfo = getRouteInfo(container);
console.log(prettyjson.render(routeInfo));