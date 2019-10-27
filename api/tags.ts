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