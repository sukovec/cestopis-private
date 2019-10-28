import * as Routes from "./routes";
import * as Configuration from "./configuration";
import * as Diary from "./diary";
import * as Photos from "./photos";
import * as Writers from "./writers";
import * as User from "./user"
import * as Tags from "./tags";

export enum APIResponseResult {
    OK = "ok",
    Fail = "fail"
}

// Generic
export type RespID = string;

// Routes
export type RespRoute = Routes.SavedRoute;
export type RespRouteList = Routes.SavedRouteDescription[];
export type RespRoutePoints = Routes.LatLng[];

// Tags
export type RespTagList = Tags.PhotoTag[];

// Photos
export type RespPhotoDirlist = Photos.DirectoryStats[];
export type RespPhotoListSimple = string[];
export type RespPhotoListFull = Photos.Photo[];
export type RespPhotoList = RespPhotoListFull | RespPhotoListSimple; // it can be either just list of ID's or full list with metadatas
export type RespPhotoAround = Photos.PhotoAround;
export type RespPhotoInfo = Photos.Photo;

// Writers
export type RespWriterList = Writers.Writer[];
export type RespWriter = Writers.Writer;

// Diary
export type RespPost =  Diary.Post;
export type RespPostList = Diary.Post[];

// User and configuration
export type RespChallenge = string;
export type RespLoginStatus = User.LoginStatus;
export type RespConfiguration = Configuration.Configuration;
export type RespUserConfig = User.UserConfig;


export type APIPossibleResponse = 
    // Generic
    void | 
    RespID | 

    // Routes
    RespRoute | 
    RespRouteList |
    RespRoutePoints |

    // Tags
    RespTagList | 

    // Photos
    RespPhotoInfo |
    RespPhotoDirlist | 
    RespPhotoList |
    RespPhotoAround | 

    // Writers
    RespWriterList | 
    RespWriter | 

    // Diary
    RespPost | 
    RespPostList | 

    // Users and configuration
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