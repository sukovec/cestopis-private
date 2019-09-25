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
export type APIPossibleResponse = void | APIResponseRoute;


export interface APIResponse<T extends APIPossibleResponse > {
    result: APIResponseResult;
    resultDetail?: string;
    data: T;
}