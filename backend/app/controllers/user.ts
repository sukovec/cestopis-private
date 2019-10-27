import { controller, httpGet, requestBody, httpPost, httpPatch, request } from 'inversify-express-utils';
import { inject } from "inversify";
import * as express from "express";

import TYPES from "../const/types";

import * as API from "../api/ifaces";
import UserService from '../services/user';

@controller('/api/user')
export class LoginController {
    constructor(@inject(TYPES.UserService) private authsrv: UserService) {

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

    @httpPost("/logout") // why disallow to logout someone who is not logged?
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

        let user: API.User;

        try { 
            user = await this.authsrv.getUserByName(body.user);
        } catch (er) {
            throw new Error("User does not exists");
        }

        let result = await this.authsrv.authenticate(body, req.session.challenge);
        req.session.challenge = undefined;
        if (result) {
            req.session.logged = true;
            req.session.user = user.username;
            req.session.userId = user._id;
            req.session.admin = user.admin;
        }

        return {
            result: API.APIResponseResult.OK,
            data: {
                logged: result,
                user: result ? body.user : undefined
            }
        };
    }

    // NEED LOGIN alias non-private methods:

    @httpGet("/config", TYPES.NeedLogin)
    public getUserConfig(@request() req: express.Request): Promise<API.APIResponse<API.UserConfig>> {
        return this.authsrv.getUserById(req.session.userId)
        .then( (usr: API.User) => {
            return {
                result: API.APIResponseResult.OK,
                data: usr.userConfig
            }
        })
        .catch( (err) => {
            return {
                result: API.APIResponseResult.OK,
                data: null,
                resultDetail: err
            }
        });
    }

    @httpPatch("/config", TYPES.NeedLogin) 
    public updateUserConfig(@request() req: express.Request, @requestBody() body: API.UserConfig): Promise<API.APIResponse<void>> {
        return this.authsrv.updateUserConfig(req.session.userId, body)
        .then( () => {
            return {
                result: API.APIResponseResult.OK,
                data: null
            }
        })
        .catch( (err) => {
            return {
                result: API.APIResponseResult.OK,
                data: null,
                resultDetail: err
            }
        });
    }
}
