import fetchOrig from "node-fetch";
import * as crypto from "crypto";
import CFG from "../app/const/config";
import * as API from "../app/api/main";
import { TextEncoder } from "util";

export const fetch = require("fetch-cookie")(fetchOrig) as typeof fetchOrig; // oink

function sha256(str: string): string {
    let tenc = new TextEncoder();

    let hash = crypto.createHash("sha256")
    hash.update(tenc.encode(str));
    let hashed = hash.digest();

    const uintarr = Array.from(new Uint8Array(hashed));
    return uintarr.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getChallenge(): Promise<string> {
    console.log("Getting challenge");
    return fetch(`http://localhost:${CFG.serverPort}/api/user/challenge`, {})
        .then(resp => resp.json())
        .then((res: API.APIResponse<API.RespChallenge>) => {
            return res.data;
        });
}

export async function login(user: string, pass: string): Promise<boolean> {
    let challenge = await getChallenge();
    let pwhash = sha256(pass);
    let salted = sha256(challenge + pwhash);

    let log: API.LoginRequest = {
        passwd: salted,
        user: user
    };

    console.log("Sending login request");

    let result = await fetch(`http://localhost:${CFG.serverPort}/api/user/login`, {
        method: "POST",
        body: JSON.stringify(log),
        headers: { "content-type": "application/json" }
    });
    let res: API.APIResponse<API.LoginStatus> = await result.json();

    if (res.result == API.APIResponseResult.Fail) 
        throw new Error("API call for login failed");
    
    if (res.data && res.data.logged) {
        console.log("Logged in");
        return true;
    } else {
        console.log("Failed");
        console.log(res);

        throw new Error("Login failed");
    }
}