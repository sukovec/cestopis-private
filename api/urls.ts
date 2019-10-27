import ApiUrl from "./apiUrl";

export class Diary extends ApiUrl {
    protected readonly _root = "/diary";
    protected readonly post = "/:id";
}

export class Misc extends ApiUrl{
    protected readonly _root = "/misc";
}

export class Photos extends ApiUrl{
    protected readonly _root = "/photos";
}

export class Routes extends ApiUrl {
    protected readonly _root = "/routes";
}

export class Tags extends ApiUrl {
    protected readonly _root = "/tags";
}

export class Users extends ApiUrl {
    protected readonly _root = "/users";
}

export class Writers extends ApiUrl {
    protected readonly _root = "/writers";
}