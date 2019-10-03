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

/*********************************/
//               API             //
/*********************************/

export interface APIRequestRoute {
    from: RoutePoint;
    to: RoutePoint;
}

export enum APIResponseResult {
    OK = "ok",
    Fail = "fail"
}

export type RespRoute = LatLng[];
export type RespID = string;
export type RespPhotoDirlist = string[];
export type RespPhotoList = string[];
export type RespTagList = PhotoTag[];

export type APIPossibleResponse = 
    void | 
    RespRoute | 
    Photo |
    RespTagList | 
    RespID | 
    RespPhotoDirlist | 
    RespPhotoList;
    
export interface APIResponse<T extends APIPossibleResponse > {
    result: APIResponseResult;
    resultDetail?: string;
    data: T;
}