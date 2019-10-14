import { BaseMiddleware } from "inversify-express-utils";
import { provide } from "inversify-binding-decorators";

import * as express from "express";

import TYPES from "../const/types";
import * as API from "../common/ifaces";


@provide(TYPES.NeedLogin)
class NeedLoginMiddleware extends BaseMiddleware{
    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {

        if (req.session.logged)
            next();
        else {
            let body: API.APIResponse<void> = {
                result: API.APIResponseResult.Fail,
                resultDetail: "!login",
                data: undefined
            };
            res.status(403);
            res.send(body);
        }
    }
}
