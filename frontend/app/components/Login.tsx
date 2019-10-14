import { h } from "preact";
import { route } from "preact-router";

// components
import Button from "preact-material-components/Button";
import TextField from "preact-material-components/TextField";

// local compnents
import BaseComponent from "./BaseComponent";

import { IDefProps, IDefState } from "../iface";
import { HIValue } from "../lib/onchange";
import * as API from "../common/ifaces";

interface ILoginProps extends IDefProps {
}

interface ILoginState extends IDefState {
    username: string;
    password: string;
    challenge: string;
    logged: boolean;
}

export default class Login extends BaseComponent<ILoginProps, ILoginState> {
    constructor(p: ILoginProps, ctx: any) {
        super(p, ctx);
        this.state = {
            username: null,
            password: null,
            challenge: null,
            logged: false
        }

        this.login = this.login.bind(this);
    }

    componentDidMount() {
        this.download("login status", "/api/auth/status")
            .then((res: API.RespLoginStatus) => {
                this.setState({ logged: res.logged, username: res.user });
            });
    }

    async login() {
        let usr = this.state.username;
        let pwd = this.state.password;
        /**/
        //crypto.subtle
        //return this.download("login", "/api/auth/login", "POST", )

        let txe = new TextEncoder();

        // download challenge
        let challenge: API.RespChallenge = await this.download("challenge", "/api/auth/challenge")
        
        // digest user-entered password
        let pwbin = txe.encode(pwd); // utf8 -> bin
        let dgst = await crypto.subtle.digest("SHA-256", pwbin); // sha256(pwd)
        
        // make it hex, join with challenge and binarize 
        let pwhashhex = Array.from(new Uint8Array(dgst)).map(b => b.toString(16).padStart(2, '0')).join('');
        pwbin = txe.encode(challenge + pwhashhex); // utf8->bin(challenge+sha256(pwd))
        dgst = await crypto.subtle.digest("SHA-256", pwbin); // sha256(challenge+sha256(pwd))
        let finalhash = Array.from(new Uint8Array(dgst)).map(b => b.toString(16).padStart(2, '0')).join('');
        let body: API.LoginRequest = {
                    user: usr,
                    passwd: finalhash
                };

        let logstat: API.RespLoginStatus = await this.download("login", "/api/auth/login", "POST", body);
            
        this.setState({ logged: logstat.logged, username: logstat.user, password: null });
        if (!logstat.logged)
            this.displayMessage("Login error", "Login have failed")
    }

    r() {
        const { logged, username, password } = this.state;
        if (logged) {
            return <h1>Hello {username}</h1>;
        }

        return <div>
            <TextField helperText="User name" onChange={HIValue(this, "username")} value={username} /><br />
            <TextField helperText="Password" type="password" onChange={HIValue(this, "password")} value={password} /><br />
            <Button onClick={this.login}>Button</Button>
        </div>
    }
}