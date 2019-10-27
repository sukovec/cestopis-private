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