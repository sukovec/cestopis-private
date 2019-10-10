import { h, Component } from "preact";
import { route } from "preact-router";

import Button from "preact-material-components/Button";
import TextField from "preact-material-components/TextField";

import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";
import { HIValue } from "../../lib/onchange";

interface WriterEditProps extends IDefProps {
    writerId?: string;
}

interface WriterEditState {
    loaded: boolean,
    writerName: string,
    writerInfo: string,
    opResult: string,
    error: string
}

export default class WriterEdit extends Component<WriterEditProps, WriterEditState> {
    constructor() {
        super();
        this.state = {
            loaded: false,
            writerName: "",
            writerInfo: "",
            opResult: null,
            error: null
        };

        this.uploadData = this.uploadData.bind(this);
    }

    fetchData(id: string) {
        fetch(`/api/writers/${id}`, { method: "GET", cache: "no-cache" })
        .then(res => res.json())
        .then((res: API.APIResponse<API.RespWriter>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({ loaded: false, error: res.resultDetail });
            } else {
                this.setState({ loaded: true, error: null, writerName: res.data.fullName, writerInfo: res.data.selfDescription });
            }
        }).catch( (err) => {
            this.setState({loaded: false, error: err});
        });
    }

    uploadData() {
        let body: API.Writer = {
            fullName: this.state.writerName,
            selfDescription: this.state.writerInfo
        };

        let URL = "/api/writers/"; 
        if (this.props.writerId) 
            URL = URL + this.props.writerId;

        let method = this.props.writerId ? "PATCH" : "POST";

        fetch(URL, { 
            method: method, 
            cache: "no-cache", 
            headers: {"content-type": "application/json"},
            body: JSON.stringify(body) })
        .then(res => res.json())
        .then((res: API.APIResponse<API.RespID>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({ error: res.resultDetail, opResult: "Update/insert failed" });
            } else {
                if(this.props.writerId) { //it's editing
                    this.setState({ opResult: "Update successfull" });
                } else {
                    route(`/writers/${res.data}`);
                }
            }
        });

    }

    clearData() {
        this.setState({loaded: true, writerName: "", writerInfo: "", error: null});
    }

    componentDidUpdate(prevProps: WriterEditProps) {
        if (prevProps.writerId != this.props.writerId) {
            if (!this.props.writerId)
                this.clearData();
            else 
                this.fetchData(this.props.writerId);
        }
    }

    componentDidMount() {
        this.componentDidUpdate({writerId: ""});
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        const { loaded, error, writerName, writerInfo, opResult } = this.state;

        if (!loaded && !error) {
            return <h1>Loading writers list ...</h1>
        } else if (!loaded && error) {
            return <h1>Error: {error}</h1>
        } else if (error && loaded) {
            return <h1>WriterEdit WTF state</h1>;
        } else {
            let opr = opResult ? <h2>OpResult: {this.state.opResult}</h2> : null;
            return <div>
                {opr}
                <h1>{this.props.writerId ? "Edit writer details" : "Create new writer"}</h1>
                <TextField width={180} onChange={HIValue(this, "writerName")} value={writerName} /><br />
                <TextField textarea={true} rows={12} cols={120} onChange={HIValue(this, "writerInfo")} value={writerInfo} />

                <Button onClick={this.uploadData}>{this.props.writerId ? "Update" : "Add new"}</Button>
            </div>
        }

    }
}