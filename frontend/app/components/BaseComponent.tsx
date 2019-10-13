import * as X from "../iface";
import * as API from "../common/ifaces";
import LoadingDisplay from "./LoadingDisplay";

import { h, Component, VNode } from "preact";

// let's call this über-prasárna and try to look that it's not that bad
export default abstract class BaseComponent<P extends X.IDefProps, S extends X.IDefState> extends Component<P, S> {
    public constructor(props: P, context: any) {
        super(props, context);
    }

    private addDownload(display: string, opts: RequestInit, url: string): X.RunningDownload {
        let down = {
            display: display,
            opts: opts, 
            url: url
        };

        this.setState( (prevState) => {
            let downs = prevState.__downloads;
            if (!downs)
                downs = new Set();

            downs.add(down);
            return { __downloads: downs };
        });

        return down;
    }

    private downloadFinished(down: X.RunningDownload) {
        this.setState((oldst) => {
            oldst.__downloads.delete(down);
            return {};
        });
    }

    protected addError(err: string | Error, repairCb?: () => void): X.DisplayedError {
        let erdef = {
            error: err,
            repairCb: repairCb,
            hidden: false,
            hideable: false
        };

        this.setState( (prev) => {
            let errorset = prev.__errors;
            if (!errorset)
                errorset = new Set();
            
            errorset.add(erdef);
            return { __errors: errorset };
        });

        return erdef;
    }

    private removeError(err: X.DisplayedError) {
        this.setState((oldst) => {
            oldst.__errors.delete(err);
            return {};
        });
    }


    protected download<A extends API.APIPossibleResponse, T extends API.APIResponse<A>>(display: string, url: string, method?: string, body?: any): Promise<A> {
        let opts: RequestInit = { 
            method: method,
            cache: "no-cache"
        };

        if (body) { 
            opts.headers = { "content-type": "application/json" };
            opts.body = JSON.stringify(body);
        }

        let cdown = this.addDownload(display, opts, url);
        let ret = fetch(url, opts)
        .then( (res) => {
            return res.json();
        })
        .then( (res: T) => {
            this.downloadFinished(cdown);
            if (res.result == API.APIResponseResult.OK) {
                return res.data;
            } else {
                this.addError(res.resultDetail, () => {
                    this.download(display, url, method, body);
                });
            }
        });

        ret.catch( (err) => {
            this.downloadFinished(cdown);
            this.addError(err, () => {
                this.download(display, url, method, body);
            });
        });

        return ret;
    }

    renderError(err: X.DisplayedError) {
        let retry = null;
        if (err.repairCb)
            retry = <a onClick={() => { err.repairCb(); this.removeError(err); }}>Try repeat!</a>;

        return <li>Error: {err.error} {retry}</li>;
    }

    render(): VNode<any> | null {
        if (this.state.__downloads && this.state.__downloads.size > 0) {
            return <LoadingDisplay>
                    <ul>
                        {Array.from(this.state.__downloads).map(itm => <li>{itm.display}</li>)}
                    </ul>
                </LoadingDisplay>
        }

        if (this.state.__errors && this.state.__errors.size > 0) {
            return <div class="errordisplay">
                <h2>Errors:</h2>
                <ul>
                    {Array.from(this.state.__errors).map(this.renderError.bind(this))}
                </ul>
            </div>;
        }
        
        return this.r();
    }

    abstract r(): VNode<any> | null;
}