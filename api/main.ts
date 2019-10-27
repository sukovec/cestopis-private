export * from "./photos";
export * from "./routes";
export * from "./tags";
export * from "./writers";
export * from "./diary";
export * from "./user";
export * from "./configuration";
export * from "./ifaces";

import * as URL from "./urls";

export const Urls = {
    Diary: new URL.Diary(),
    Misc: new URL.Misc(),
    Photos: new URL.Photos(),
    Routes: new URL.Routes(),
    Tags: new URL.Tags(),
    Users: new URL.Users(),
    Writers: new URL.Writers()
};
