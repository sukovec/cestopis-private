import { h, render, Component } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

interface DirListProps extends IDefProps {
}

interface DirListStats {
    dirlist: API.RespPhotoDirlist,
    error: string
}

export default class DirList extends Component<DirListProps, DirListStats> {

    constructor() {
        super();
        this.state = {
            dirlist: null,
            error: null
        };
    }

    componentDidMount() {
        fetch("/api/photos/dirs", { cache: "no-cache"})
        .then(res => res.json())
        .then( (res: API.APIResponse<API.RespPhotoDirlist>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({dirlist: null, error: res.resultDetail });
            } else {
                this.setState({dirlist: res.data, error: null })
            }
        });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        let dirlist = this.state.dirlist;
        let error = this.state.error;

        if(dirlist == null && error == null) {
            return <h1>Loading dirs ...</h1>
        } else if (dirlist == null && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && dirlist != null) {
            return <h1>PhotoTaggerDirlist WTF state</h1>;
        } else {
            return <table>
                    <tr><th>Folder</th><th>MultiTag</th><th>Count total</th><th>Untagged</th><th>Places</th></tr>
                {dirlist.map(itm => <tr>
                    <td><a href={`/photos/dir/${itm.dirName}`}>{itm.dirName}</a></td>
                    <td><a href={`/photos/multitag/${itm}`}>MULTI</a></td>
                    <td>{itm.photos}</td>
                    <td class={itm.untagged == 0 ? "perfect" : (itm.untagged == itm.photos ? "untouched" : "notbad")}>{itm.untagged}</td>
                    <td>{itm.places.join(", ")}</td>
                    </tr>)
                }
                </table>
        }
        
    }
}