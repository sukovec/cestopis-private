import { h } from "preact";
import FormField from "preact-material-components/FormField";
import Radio from "preact-material-components/Radio";

// components
import { HIValue } from "../../lib/onchange";
import { IDefProps, IDefState } from "../../iface";
import * as API from "../../api/ifaces";


// components
import BaseComponent from "../BaseComponent";

const unsetFilter: API.PhotoSource = "--impossible-value-of-source--" as API.PhotoSource;

interface DirListProps extends IDefProps {
}

interface DirListStats extends IDefState {
    dirlist: API.RespPhotoDirlist;
    curFilter: API.PhotoSource;
}

export default class DirList extends BaseComponent<DirListProps, DirListStats> {
    constructor(p: DirListProps, ctx: any) {
        super(p, ctx);
        this.state = {
            dirlist: null,
            curFilter: unsetFilter
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

    renderFilterSource() {
        let phoso: any = API.PhotoSource;

        const { curFilter } = this.state;
        return <fieldset onChange={HIValue(this, "curFilter")}>
            <FormField><Radio name="filterSource" value={unsetFilter} checked={curFilter == unsetFilter} />Don't filter</FormField>
            {Object.keys(phoso).map( (itm: string) => {
                let key = phoso[itm];
                return <FormField><Radio name="filterSource" value={phoso[itm]} checked={phoso[itm] == curFilter} />{itm}</FormField>
            })}
        </fieldset>;
    }

    r() {
        let dirlist = this.state.dirlist;
        let curFilter = this.state.curFilter;
        if (!dirlist) return <h1>Not loaded</h1>;

        return <div>
            {this.renderFilterSource()}<table>
                <tr><th>Folder</th><th>MultiTag</th><th>Count total</th><th>Untagged</th><th>Places</th></tr>
                {
                    dirlist
                    .filter(itm => curFilter === unsetFilter || itm.sources.includes(curFilter))
                    .map(itm => <tr>
                    <td><a href={`/photos/dir/${itm.dirName}`}>{itm.dirName}</a></td>
                    <td><a href={`/photos/multi/${itm.dirName}`}>MULTI</a></td>
                    <td>{itm.photos}</td>
                    <td class={itm.untagged == 0 ? "perfect" : (itm.untagged == itm.photos ? "untouched" : "notbad")}>{itm.untagged}</td>
                    <td>{itm.places.join(", ")}</td>
                </tr>)
                }
            </table>
        </div>
    }
}