import ApiUrl from "./apiUrl";

export class Diary extends ApiUrl {
    protected readonly _root = "/diary";

    public readonly all = "/";
    public readonly post = "/:id";
}

export class Misc extends ApiUrl{
    protected readonly _root = "/misc";

    public readonly config = "/config";
}

export class Photos extends ApiUrl{
    protected readonly _root = "/photos";

    public readonly dirlist = "/dirs";
    public readonly allphotos = "/photos";
    public readonly photosdir = "/photos/:dir";
    public readonly photo = "/photo/:id";
    public readonly metadata = "/photo/:id/info";
    public readonly thumbnail = "/photo/:id/thumb";
    public readonly original = "/photo/:id/original";
    public readonly around = "/photo/:id/around";
    public readonly multitag = "/multitag";
}

export class Routes extends ApiUrl {
    protected readonly _root = "/routes";
    public readonly between = "/between";
    public readonly all = "/";
    public readonly specific = "/:idRoute";
}

export class Tags extends ApiUrl {
    protected readonly _root = "/tags";

    public readonly taglist = "/";
}

export class Users extends ApiUrl {
    protected readonly _root = "/user";

    public readonly status = "/status";
    public readonly challenge = "/challenge";
    public readonly login = "/login";
    public readonly logout = "/logout";
    public readonly config = "/config";
}

export class Writers extends ApiUrl {
    protected readonly _root = "/writers";

    public readonly listall = "/";
    public readonly actual = "/:writerId";
}