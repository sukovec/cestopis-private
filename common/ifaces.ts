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
    tag: string;
    subtag?: string;
}

export interface Photo {
    _id?: string;
    tags: PhotoSetTag[];
    source: PhotoSource;
    date: Date;
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

export type APIResponseRoute = LatLng[];
export type APIResponseID = string;
export type APIPossibleResponse = void | APIResponseRoute | APIResponseID;


export interface APIResponse<T extends APIPossibleResponse > {
    result: APIResponseResult;
    resultDetail?: string;
    data: T;
}