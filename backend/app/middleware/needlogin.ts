import { BaseMiddleware } from "inversify-express-utils";
import { provide } from "inversify-binding-decorators";

import * as express from "express";

import TYPES from "../const/types";
import CFG from "../const/config";
import * as API from "../common/ifaces";

function isLocalhost(req: express.Request) {
    const LOCALHOST = ["127.0.0.1", "::1"];

    if (CFG.usingReverseProxy) {
        return LOCALHOST.includes(req.connection.remoteAddress) && !req.headers["x-forwarded-for"];
    } else {
        return LOCALHOST.includes(req.connection.remoteAddress);
    }
}

@provide(TYPES.NeedAdmin)
class NeedAdmin extends BaseMiddleware{
    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        console.log("Need admin. Is it admin?");
        if (isLocalhost(req) && req.session.admin) {
            console.log("Yes, it is");
            next();
        } else {
            console.log("No, it's not!");
            let body: API.APIResponse<void> = {
                result: API.APIResponseResult.Fail,
                resultDetail: "!login-local",
                data: undefined
            };
            res.status(403);
            res.send(body);
        }
    }

}

@provide(TYPES.NeedLogin)
class NeedLogin extends BaseMiddleware{
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
