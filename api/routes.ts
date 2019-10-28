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

export interface SavedRoute { 
    _id: string;
    dayTaken: string;
    descript: string;
    comment: string;
    transportType: RouteTransportMethod;
    routePoints: RoutePoint[];
}

export type SavedRouteDescription = Partial<SavedRoute>;