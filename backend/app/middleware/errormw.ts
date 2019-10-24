import { BaseMiddleware } from "inversify-express-utils";
import { provide } from "inversify-binding-decorators";

import * as express from "express";

import TYPES from "../const/types";
import * as API from "../common/ifaces";

export default function errorMiddleware(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!res.headersSent) {
        res.status(500);
    }

    let body: API.APIResponse<void> = {
        result: API.APIResponseResult.Fail,
        resultDetail: err.message ? err.message : err,
        data: undefined
    };

    res.send(body);
    next();
}