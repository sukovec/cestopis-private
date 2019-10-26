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