import * as X from "../iface";
import * as API from "../common/ifaces";
import Dialog from "./Dialog";
import Button from "preact-material-components/Button";
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

    protected displayMessage(title: string, text: string, onAccept?: () => void, onCancel?: () => void): void {
        this.setState({
            __message: {
                title: title,
                text: text,
                onAccept: onAccept, 
                onCancel: onCancel
            }
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
            cache: "no-cache",
            credentials: "same-origin"
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

    renderMessage(msg: X.DisplayMessage) {
        let cancbut = msg.onCancel ? <Button cancel={true}>Cancel</Button> : null;

        let acpt = () => {
            this.setState({__message: null});
            if (msg.onAccept)
                msg.onAccept();
        };

        return <span>
            <Dialog visible={true}>
                <Dialog.Header>{msg.title}</Dialog.Header>
                <Dialog.Body>{msg.text}</Dialog.Body>
                <Dialog.Footer>
                    <Button onClick={acpt}>OK</Button>
                    {cancbut}
                </Dialog.Footer>
            </Dialog>
            {this.r()} 
            </span>
    }

    render(): VNode<any> | null {
        if (this.state.__downloads && this.state.__downloads.size > 0) {
            return <Dialog visible={true}>
                <Dialog.Header>Loading...</Dialog.Header>
                <Dialog.Body>
                    <ul>
                        {Array.from(this.state.__downloads).map(itm => <li>{itm.display}</li>)}
                    </ul>
                </Dialog.Body>
                </Dialog >
        }

        if (this.state.__errors && this.state.__errors.size > 0) {
            return <div class="errordisplay">
                <h2>Errors:</h2>
                <ul>
                    {Array.from(this.state.__errors).map(this.renderError.bind(this))}
                </ul>
            </div>;
        }

        if (this.state.__message) 
            return this.renderMessage(this.state.__message);
        
        return this.r();
    }

    abstract r(): VNode<any> | null;
}