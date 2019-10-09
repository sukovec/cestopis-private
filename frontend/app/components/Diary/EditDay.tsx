import { h, Component } from "preact";
import { route } from "preact-router";
// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";
import { HIValue } from "../../lib/onchange";

interface EditDayProps extends IDefProps {
    day?: string;
}

interface EditDayState {
    date: string;
}

export default class EditDay extends Component<EditDayProps, EditDayState> {
    private onDateChange: (evt: Event) => void;
    constructor() {
        super();
        this.state = {
                date: ""
        };

        this.onDateChange = HIValue(this, "date");
    }

    componentDidMount() {
        if (this.props.day) {
            fetch(`/api/days/${this.props.day}`);
        }
        /*fetch("/api/photos/dirs", { cache: "no-cache"})
        .then(res => res.json())
        .then( (res: API.APIResponse<API.RespPhotoDirlist>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({dirlist: null, error: res.resultDetail });
            } else {
                this.setState({dirlist: res.data, error: null })
            }
        });*/
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        console.log(this.state);
        return <div>
            <input type="text" value={this.state.date} onChange={this.onDateChange} />
            </div>;      
    }
}