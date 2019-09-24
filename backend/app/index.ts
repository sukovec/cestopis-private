import "reflect-metadata";

import * as express from "express";
import * as bodyParser from 'body-parser';
import * as path  from "path";

import { Container } from "inversify";
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { buildProviderModule } from "inversify-binding-decorators";

// support
import "./sup/db"

// controllers:
import "./controllers/routes";


// set up container
let container = new Container();

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
	// add body parser
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use("/", express.static(path.resolve("../frontend/dist")));
});

container.load(buildProviderModule())

let app = server.build();
app.listen(9080);



console.log("Running on http://localhost:9080/");
console.log("Static from: ", path.resolve("../frontend/dist"));
