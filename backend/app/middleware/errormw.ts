import * as express from "express";

import * as API from "../api/main";

export default function errorMiddleware(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.error(`ERROR 500 on ${req.url}`);
    console.log(err);

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