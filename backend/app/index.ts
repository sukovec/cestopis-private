import "reflect-metadata";

import * as express from "express";
import * as bodyParser from 'body-parser';
import * as path  from "path";
import * as session from "express-session";
import * as uuid from "uuid/v4";

import { Container } from "inversify";
import { InversifyExpressServer } from 'inversify-express-utils';
import { buildProviderModule } from "inversify-binding-decorators";


import CFG from "./const/config";

// support
import "./services/db"
import "./services/srvphotos";
import "./services/serviceWriters";
import "./services/serviceDiary";
import "./services/auth";

// controllers:
import "./controllers/routes";
import "./controllers/photos";
import "./controllers/diary";
import "./controllers/writers";
import "./controllers/login";

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
		store: new sesstore({filename: `${CFG.databasePath}/session.ndb` }),
		genid: (req) => { return uuid() }
	}));
	app.use("/", express.static(path.resolve("../frontend/dist")));
});

container.load(buildProviderModule())

let app = server.build();
app.listen(CFG.serverPort, CFG.serverListen);

console.log("Roonning on http://localhost:9080/");
console.log("Static from: ", path.resolve("../frontend/dist"));
