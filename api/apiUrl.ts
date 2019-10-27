const urlRoot = "/api";

type UrlPart = string | number | boolean;
type KeyVal = {[key: string]: UrlPart};

export default abstract class ApiUrl {
    protected abstract readonly _root: string;
    private static readonly argregex = /:[a-zA-Z0-9]*/g;

    public r(): string {
        return urlRoot + this._root;
    }

    private createQueryString(query: KeyVal): string {
        return "?" + Object.keys(query)
            .filter(itm => query.hasOwnProperty(itm))
            .map( (key) => {
                let val = query[key];
                return encodeURIComponent(key) + "=" + encodeURIComponent(val);
            })
            .join("&");
    }

    private replaceArray(path: string, args: UrlPart[]): string {
        let mt = path.match(ApiUrl.argregex);
        if (!mt) {
            if (args.length > 0)
                console.warn("Got arguments on argument-less URL");
            return path;
        }
        if (mt.length > args.length) throw new Error(`Unsufficient number of request to generate API call path, expected ${mt.length}, got ${args.length}`);
        if (mt.length < args.length) {
            console.warn(`Got more arguments (${args.length} than needed ${mt.length})`);
            
            args = args.slice(0, mt.length);
        }

        let argsobj = mt.reduce((prev, cur, idx) => {
            prev[cur.substr(1)] = args[idx];
            return prev;
        }, {} as any);

        return this.replaceObject(path, argsobj);
    }

    private replaceObject(path: string, args: KeyVal): string {
        return path.replace(ApiUrl.argregex, (match, contents, offset, input_string) => {
            let toget = match.substr(1);
            if (!args.hasOwnProperty(toget)) {
                console.log(toget);
                console.log(match);
                console.log(args);
                throw new Error(`Cannot generate API call path, argument ${toget} missing`);
            }
            return String(args[toget]);
        });
    }

    public p(path: keyof this, ...rest: UrlPart[]): string;
    public p(path: keyof this, params?: KeyVal): string;
    public p(path: keyof this): string
    {
        let pth = this[path] as unknown as string; 
        if (typeof arguments[1] === "object")
            return this.r() + this.replaceObject(pth, arguments[1]);

        let restargs = [];
        for (var i = 0; i < arguments.length - 1; i++) 
            restargs[i] = arguments[i + 1];       
        
        return this.r() + this.replaceArray(pth, restargs);   
    }

    // right now, I don't have better idea, how to implement this and don't repeat most of code
    // TODO: If somehow possible, implement checking query params
    /**
     * Create path defined in ApiUrl object named @param path with query string parameters
     * @param path Path name as defined in ApiUrl object
     * @param query Key-value of query parameters
     * @param rest Replace :names in defined path
     */
    public q(path: keyof this, query: KeyVal, ...rest: UrlPart[]): string;
    public q(path: keyof this, query: KeyVal, params?: KeyVal): string;
    public q(path: keyof this, query: KeyVal): string {
        let pth = this[path] as unknown as string; 
        if (typeof arguments[2] === "object")
            return this.r() + this.replaceObject(pth, arguments[1]) + this.createQueryString(query);

        let restargs = [];
        for (var i = 0; i < arguments.length - 2; i++) 
            restargs[i] = arguments[i + 2];       
        
        return this.r() + this.replaceArray(pth, restargs) + this.createQueryString(query);   
    }
}
