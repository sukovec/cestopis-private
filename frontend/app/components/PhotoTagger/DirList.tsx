import { h, render, Component } from "preact";
import { route } from "preact-router";

// components
import { IDefProps, IDefState } from "../../iface";
import * as API from "../../common/ifaces";

// components
import BaseComponent from "../BaseComponent";

interface DirListProps extends IDefProps {
}

interface DirListStats extends IDefState {
    dirlist: API.RespPhotoDirlist,
}

export default class DirList extends BaseComponent<DirListProps, DirListStats> {

    constructor(p: DirListProps, ctx: any) {
        super(p, ctx);
        this.state = {
            dirlist: null,
        };
    }

    fetchDirlist() {
        this.download("directory list", "/api/photos/dirs")
            .then((res: API.RespPhotoDirlist) => {
                this.setState({ dirlist: res })
            });
    }

    componentDidMount() {
        this.fetchDirlist();
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    r() {
        let dirlist = this.state.dirlist;
        if (!dirlist) return <h1>Not loaded</h1>;

        return <table>
            <tr><th>Folder</th><th>MultiTag</th><th>Count total</th><th>Untagged</th><th>Places</th></tr>
            {dirlist.map(itm => <tr>
                <td><a href={`/photos/dir/${itm.dirName}`}>{itm.dirName}</a></td>
                <td><a href={`/photos/multitag/${itm.dirName}`}>MULTI</a></td>
                <td>{itm.photos}</td>
                <td class={itm.untagged == 0 ? "perfect" : (itm.untagged == itm.photos ? "untouched" : "notbad")}>{itm.untagged}</td>
                <td>{itm.places.join(", ")}</td>
            </tr>)
            }
        </table>
    }
}