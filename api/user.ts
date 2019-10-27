import { LatLng } from "./routes";

export interface UserConfig { 
    assocWriterId: string;
    lastDate: string;
    lastMapCoords: LatLng;
    lastMapZoom: number;
}

// TODO: Move out. This is internal, just for backend and must not be moved out
export interface User {
    _id?: string;
    username: string;
    pwhash: string; // password hashed by sha256
    admin?: boolean; // if admin, can connect only from localhost
    userConfig: UserConfig;
}

export interface LoginRequest {
    user: string; // username
    passwd: string; // sha256(challenge + sha256(password))
}

export interface LoginStatus { 
    logged: boolean;
    user: string;
}