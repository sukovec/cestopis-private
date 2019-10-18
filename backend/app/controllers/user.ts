import { controller, httpGet, requestBody, httpPost, httpDelete, requestParam, request } from 'inversify-express-utils';
import { inject } from "inversify";
import * as express from "express";

import TYPES from "../const/types";

import * as API from "../common/ifaces";
import AuthService from '../services/auth';

@controller('/api/user')
export class LoginController {
    constructor(@inject(TYPES.AuthService) private authsrv: AuthService) {

    }

    @httpGet("/status")
    public getLoginStatus(@request() req: express.Request): API.APIResponse<API.RespLoginStatus> {
        if (req.session.logged) {
            return {
                result: API.APIResponseResult.OK,
                data: {
                    logged: true,
                    user: req.session.user
                }
            };
        }
        else {
            return {
                result: API.APIResponseResult.OK,
                data: {
                    logged: false,
                    user: undefined
                }
            };
        }
    }

    // initialize session and return challenge string
    @httpGet("/challenge")
    public getChallenge(@request() req: express.Request): API.APIResponse<API.RespChallenge> {
        req.session.challenge = this.authsrv.getRandomHexString(32);
        return {
            result: API.APIResponseResult.OK,
            data: req.session.challenge
        } ;
    }

    @httpPost("/logout")
    public async logout(@request() req: express.Request): Promise<API.APIResponse<API.LoginStatus>> {
        req.session.destroy((err) => {if (!err) return ; console.error("Session destroy failed", err)});
        return {
            result: API.APIResponseResult.OK,
            data: {
                logged: false,
                user: undefined
            }
        };
    }


    @httpPost("/login")
    public async login(@request() req: express.Request, @requestBody() body: API.LoginRequest): Promise<API.APIResponse<API.LoginStatus>> {
        if (!req.session.challenge) {
            throw new Error("First, call for /api/auth/challenge");
        }

        let result = await this.authsrv.authenticate(body, req.session.challenge);
        req.session.challenge = undefined;

        if (result) {
            req.session.logged = true;
            req.session.user = body.user;
        }

        return {
            result: API.APIResponseResult.OK,
            data: {
                logged: result,
                user: result ? body.user : undefined
            }
        };
    }

}
