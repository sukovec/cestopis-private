import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../common/ifaces";

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.WritersService)
export default class WritersService { 
    constructor(@inject(TYPES.database) private database: db) {
    }
}