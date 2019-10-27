import { h } from "preact";
import { route } from "preact-router";

import Button from "preact-material-components/Button";
import TextField from "preact-material-components/TextField";

import BaseComponent from "../BaseComponent";

import { IDefProps, IDefState } from "../../iface";
import * as API from "../../api/main";

import { HIValue } from "../../lib/onchange";

interface IWriterEditProps extends IDefProps {
    writerId?: string;
}

interface IWriterEditState extends IDefState {
    writerName: string,
    writerInfo: string,
}

export default class WriterEdit extends BaseComponent<IWriterEditProps, IWriterEditState> {
    constructor(p: IWriterEditProps, ctx: any) {
        super(p, ctx);
        this.state = {
            writerName: "",
            writerInfo: "",
        };

        this.uploadData = this.uploadData.bind(this);
    }

    fetchWriter(id: string) {
        this.download("writer data", `/api/writers/${id}`)
            .then((res: API.RespWriter) => {
                this.setState({ writerName: res.fullName, writerInfo: res.selfDescription });
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

        this.download("upload data", URL, method, body)
            .then((res: API.RespID) => {
                if (this.props.writerId) { //it's editing
                    this.displayMessage("Update data", "Updating writer data was successfull");
                } else {
                    route(`/writers/${res}`);
                    this.displayMessage("Insert data", "Creating new writer was successfull");
                }

            });
    }

    clearData() {
        this.setState({ writerName: "", writerInfo: "" });
    }

    componentDidUpdate(prevProps: IWriterEditProps) {
        if (prevProps.writerId != this.props.writerId) {
            if (!this.props.writerId)
                this.clearData();
            else
                this.fetchWriter(this.props.writerId);
        }
    }

    componentDidMount() {
        this.componentDidUpdate({ writerId: "" });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    r() {
        const { writerName, writerInfo } = this.state;

        return <div>
            <h1>{this.props.writerId ? "Edit writer details" : "Create new writer"}</h1>
            <TextField width={180} onChange={HIValue(this, "writerName")} value={writerName} /><br />
            <TextField textarea={true} rows={12} cols={120} onChange={HIValue(this, "writerInfo")} value={writerInfo} />

            <Button onClick={this.uploadData}>{this.props.writerId ? "Update" : "Add new"}</Button>
        </div>
    }
}