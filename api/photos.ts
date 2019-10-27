export interface DirectoryStats {
    dirName: string;
    photos: number;
    untagged: number;
    places: string[];
    sources: PhotoSource[];
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
