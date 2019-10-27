export default abstract class ApiUrl {
    protected abstract readonly _root: string;
    private static readonly argregex = /:[a-zA-Z0-9]*/g;

    public getRoot(): string {
        return this._root;
    }

    private replaceArray(path: string, args: string[]): string {
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

    private replaceObject(path: string, args: {[name: string]: string}): string {
        return path.replace(ApiUrl.argregex, (match, contents, offset, input_string) => {
            let toget = match.substr(1);
            if (!args.hasOwnProperty(toget)) {
                console.log(toget);
                console.log(match);
                console.log(args);
                throw new Error(`Cannot generate API call path, argument ${toget} missing`);
            }
            return args[toget];
        });
    }

    public p(path: keyof this, ...rest: string[] | number[]): string;
    public p(path: keyof this, params?: {[name: string]: string | number}): string;
    public p(path: keyof this): string
    {
        let pth = this[path] as unknown as string; 
        if (typeof arguments[1] === "object")
            return this._root + this.replaceObject(pth, arguments[1]);

        let restargs = [];
        for (var i = 0; i < arguments.length - 1; i++) 
            restargs[i] = arguments[i + 1];       
        
        return this._root + this.replaceArray(pth, restargs);   
    }
}
