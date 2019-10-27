abstract class ApiUrl {
    protected abstract readonly _root: string;
    private static readonly argregex = /:[a-zA-Z0-9]*/g;

    public getRoot(): string {
        return this._root;
    }

    private replaceArray(path: string, args: string[]): string {
        let mt = path.match(ApiUrl.argregex);
        if (!mt) {
            if (args.length > 0)
                console.warn("Got arguments on argument-less URL");
            return path;
        }
        if (mt.length > args.length) throw new Error(`Unsufficient number of request to generate API call path, expected ${mt.length}, got ${args.length}`);
        if (mt.length < args.length) {
            console.warn(`Got more arguments (${args.length} than needed ${mt.length})`);
            
            args = args.slice(0, mt.length);
        }

        let argsobj = mt.reduce((prev, cur, idx) => {
            prev[cur.substr(1)] = args[idx];
            return prev;
        }, {} as any);

        return this.replaceObject(path, argsobj);
    }

    private replaceObject(path: string, args: {[name: string]: string}): string {
        return path.replace(ApiUrl.argregex, (match, contents, offset, input_string) => {
            let toget = match.substr(1);
            if (!args.hasOwnProperty(toget)) {
                console.log(toget);
                console.log(match);
                console.log(args);
                throw new Error(`Cannot generate API call path, argument ${toget} missing`);
            }
            return args[toget];
        });
    }

    public p(path: keyof this, ...rest: string[] | number[]): string;
    public p(path: keyof this, params?: {[name: string]: string | number}): string;
    public p(path: keyof this): string
    {
        let pth = this[path] as unknown as string; 
        if (typeof arguments[1] === "object")
            return this._root + this.replaceObject(pth, arguments[1]);

        let restargs = [];
        for (var i = 0; i < arguments.length - 1; i++) 
            restargs[i] = arguments[i + 1];       
        
        return this._root + this.replaceArray(pth, restargs);   
    }
}

export class UrlsDiary extends ApiUrl {
    protected readonly _root = "/diary";
    protected readonly post = "/:id";
}

export class UrlsMisc extends ApiUrl{
    protected readonly _root = "/misc";
}

export class UrlsPhotos extends ApiUrl{
    protected readonly _root = "/photos";
}

export class UrlsRoutes extends ApiUrl {
    protected readonly _root = "/routes";
}

export class UrlsTags extends ApiUrl {
    protected readonly _root = "/tags";
}

export class UrlsUsers extends ApiUrl {
    protected readonly _root = "/users";
}

export class UrlsWriters extends ApiUrl {
    protected readonly _root = "/writers";
}

export const Urls = {
    Diary: new UrlsDiary(),
    Misc: new UrlsMisc(),
    Photos: new UrlsPhotos(),
    Routes: new UrlsRoutes(),
    Tags: new UrlsTags(),
    Users: new UrlsUsers(),
    Writers: new UrlsWriters()
};


/************************************
 *              PHOTOS              *
 ************************************/

export interface DirectoryStats {
    dirName: string;
    photos: number;
    untagged: number;
    places: string[];
    sources: PhotoSource[];
};

export interface PhotoSubTag {
    tagName: string;
    translation?: string;
}

export interface PhotoTag {
    _id?: string;
    tagName: string;
    hidden: boolean;
    subtags: PhotoSubTag[];
    tagKey?: string;
    translation?: string;
};

export enum PhotoSource {
    sukofon = "sukofon", 
    sarkofon = "saryk",
    camera = "fotak",
    ticofon = "ticofon"
};

export enum PhotoType {
    rw2 = "panaraw",
    jpg = "jpeg",
    oth = "other"
};

export interface PhotoAround {
    prev: string;
    next: string;
}

export interface PhotoSetTag {
    subtag?: string;
}

export interface PhotoTagset {
    [ id: string ]: PhotoSetTag // _id of Tag
};

export interface Photo {
    _id?: string;
    tags: PhotoTagset;
    source: PhotoSource;
    date: number;
    folder: string;
    original: string;
    thumb: string;
    type: PhotoType;
    comment: string;
};

/**
 * API request to change multiple tags at multiple photos
 * API URL: `/api/photos/multitag` (PATCH only)
 * API response: void
 */
export interface MultiTagRequest {
    /**
     * Every property of request is ID of photo to be tagged
     */
    [photo_id: string]: {
        /**
         * PhotoTagset of tags which will be merged with existing tags
         */
        add?: PhotoTagset; 
        /**
         * PhotoTagset of tags which will be removed (potential subtags are ignored)
         */
        remove?: PhotoTagset;
        /**
         * PhotoTagset of tags, on which subtag should be changed to new value
         */
        change?: PhotoTagset;
    }
}

/************************************
 *              ROUTES              *
 ************************************/

export enum RouteTransportMethod {
    hitch = "hitchhiking", 
    bus = "bus", 
    rentcar = "rentcar", 
    bicycle = "bicycle", 
    walk = "walking", 
    boat = "boat", 
    plane = "plane"
}

export enum RoutePointMode {
    ByHand, Routed
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface RoutePoint {
    mode: RoutePointMode;
    latlng: LatLng;
    extRouted: LatLng[];
}

export interface APIRequestRoute {
    from: RoutePoint;
    to: RoutePoint;
}

/*********************************/
//           WRITERS             //
/*********************************/

export interface Writer {
    _id?: string;

    fullName: string;
    selfDescription: string;
}

/*********************************/
//             POSTS             //
/*********************************/

export enum PostType { // edit also styles.css to reflect all those types
    dayView = "day", 
    tiptrick = "trick", 
    budget = "budget"
}

export interface Budget {

}

export interface Post {
    _id?: string;
    date: string;
    writer: string;
    type: PostType;

    text: string;
    budget?: Budget;
}

/*********************************/
//              USER             //
/*********************************/

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

/***********************************
 *          CONFIGURATION          *
 ***********************************/

export interface Configuration {
    firstDay: string;
}

/*********************************/
//               API             //
/*********************************/


export enum APIResponseResult {
    OK = "ok",
    Fail = "fail"
}

export type RespRoute = LatLng[];
export type RespID = string;
export type RespPhotoDirlist = DirectoryStats[];

export type RespPhotoListSimple = string[];
export type RespPhotoListFull = Photo[];
export type RespPhotoList = RespPhotoListFull | RespPhotoListSimple; // it can be either just list of ID's or full list with metadatas
export type RespTagList = PhotoTag[];
export type RespPhotoAround = PhotoAround;
export type RespPhotoInfo = Photo;
export type RespWriterList = Writer[];
export type RespWriter = Writer;
export type RespPost =  Post;
export type RespPostList = Post[];
export type RespChallenge = string;
export type RespLoginStatus = LoginStatus;
export type RespConfiguration = Configuration;
export type RespUserConfig = UserConfig;

export type APIPossibleResponse = 
    void | 
    RespRoute | 
    RespPhotoInfo |
    RespTagList | 
    RespID | 
    RespPhotoDirlist | 
    RespPhotoList |
    RespPhotoAround | 
    RespWriterList | 
    RespWriter | 
    RespPost | 
    RespPostList | 
    RespChallenge |
    RespLoginStatus | 
    RespConfiguration |
    RespUserConfig ;
    
export type APIResultDetail = any; // alias error detail would be better
export interface APIResponse<T extends APIPossibleResponse > {
    result: APIResponseResult;
    resultDetail?: APIResultDetail;
    data: T;
}