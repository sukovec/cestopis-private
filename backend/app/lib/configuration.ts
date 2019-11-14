import { fluentProvide } from "inversify-binding-decorators"

function getEnv(name: string, def?: string) {
    if (process.env[name] === undefined) {
        if (def === undefined) {
            throw new Error(`The ${name} environment variable was not set!`);
        }

        console.warn(`Using default value '${def}' insteand of env '${name}'`);
        return def;
    }

    return process.env[name];
}

function getEnvInt(name: string, def?: string) {
    let envv = getEnv(name, def);

    return parseInt(envv);
}

function getEnvBool(name: string, def?: string) {
    let envv = getEnv(name, def);
    const trues = [ "true", "yes", "1" ];
    return trues.includes(envv.toLowerCase());
}

class Configuration { 
    public readonly thumbPath: string;
    public readonly rawPath: string;
    public readonly serverPort: number;
    public readonly serverListen: string;
    public readonly exportThumbPath: string;
    public readonly databasePath: string;
    public readonly sessionSecret: string;
    public readonly usingReverseProxy: boolean;
    // few controller endpoints need to work just in for localhost
    // hovewer when using reverse proxy, every request is from localhost.
    // following means that the JustForLocalhost midleware will not look 
    // at connection.req.remoteAddress but at "x-forwarded-for" header
    // always verify, that reverse-proxy sends "x-forwarded-for"!
    
    public constructor() {
        this.thumbPath = getEnv("THUMB_PATH");
        this.rawPath = getEnv("RAW_PATH");
        this.serverPort = getEnvInt("SERVER_PORT", "8090");
        this.serverListen= getEnv("SERVER_LISTEN", "127.0.0.1");
        this.exportThumbPath= getEnv("EXPORT_THUMB_PATH");
        this.databasePath = getEnv("DATABASE_PATH", "/tmp");
        this.sessionSecret = getEnv("SESSION_SECRET", "really-random.string TRUST:me");
        this.usingReverseProxy = getEnvBool("USING_REVERSE_PROXY", "false");
    }
}

export default new Configuration();