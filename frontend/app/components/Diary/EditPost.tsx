import { h, Component } from "preact";
import { route } from "preact-router";

// components
import TextField from "preact-material-components/TextField";
import FormField from "preact-material-components/FormField";
import Radio from "preact-material-components/Radio";
import Button from "preact-material-components/Button";

import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";
import { HIValue } from "../../lib/onchange";

interface EditPostProps extends IDefProps {
    postId?: string;
}

interface EditPostState {
    error: any;
    writerList: API.Writer[];
    opResult: string;

    selectedWriterId: string;
    selectedPostType: API.PostType;
    postDate: string;
    postContent: string;
}

export default class EditPost extends Component<EditPostProps, EditPostState> {
    constructor() {
        super();
        this.state = {
            error: null,
            opResult: null,
            writerList: null,
            postDate: "",
            postContent: "",
            selectedWriterId: null,
            selectedPostType: API.PostType.dayView
        };

        this.uploadPost = this.uploadPost.bind(this);
    }

    uploadPost() {
        let method = "POST";
        let URL = `/api/diary`;
        let body: API.Post = {
            date: this.state.postDate,
            text: this.state.postContent,
            type: this.state.selectedPostType,
            writer: this.state.selectedWriterId
        };

        fetch(URL, {
            method: method,
            cache: "no-cache",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then((res: API.APIResponse<API.RespID>) => {
                if (res.result == API.APIResponseResult.Fail) {
                    this.setState({ error: res.resultDetail, opResult: "Failed to save the post" });
                } else {
                    route(`/diary/${res.data}`);
                }
            })
            .catch((err) => {
                this.setState({ error: err, opResult: "Failed to save the post" });
            });
    }

    fetchWriters() {
        fetch(`/api/writers/`)
            .then(res => res.json())
            .then((res: API.APIResponse<API.RespWriterList>) => {
                if (res.result == API.APIResponseResult.Fail) {
                    this.setState({ error: res.resultDetail, writerList: null });
                } else {
                    this.setState({ writerList: res.data });
                }
            })
            .catch((err) => {
                this.setState({ error: err, writerList: null });
            });
    }

    fetchPost(id: string) {
        fetch(`/api/diary/${id}`)
            .then(res => res.json())
            .then((res: API.APIResponse<API.RespPost>) => {
                if (res.result == API.APIResponseResult.Fail) {
                    // TODO: make it sane!
                    this.setState({ error: res.resultDetail, writerList: null });
                } else {
                    this.setState({ 
                        postContent: res.data.text, 
                        postDate: res.data.date, 
                        selectedPostType: res.data.type,
                        selectedWriterId: res.data.writer
                 });
                }
            })
            .catch((err) => {
                // TODO: also make it more sane
                this.setState({ error: err, writerList: null });
            });
    }

    componentDidMount() {
        this.fetchWriters();

        this.componentDidUpdate({ postId: "" });
    }

    componentDidUpdate(oldProps: EditPostProps) {
        if (this.props.postId != oldProps.postId) 
            this.fetchPost(this.props.postId);
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////

    renderPostType() {
        let ptypes = [API.PostType.budget, API.PostType.dayView, API.PostType.tiptrick];

        return <fieldset onChange={HIValue(this, "selectedPostType")}>
            {ptypes.map(itm => <FormField><Radio name="ptypesx" value={itm} checked={itm == this.state.selectedPostType} />{itm}</FormField>)}
        </fieldset>;
    }

    renderWriterSelect(wrts: API.Writer[]) {
        return <fieldset onChange={HIValue(this, "selectedWriterId")}>
            {wrts.map(itm => <FormField><Radio name="writerselect" value={itm._id} checked={itm._id == this.state.selectedWriterId} />{itm.fullName}</FormField>)}
        </fieldset>;
    }

    render() {
        const { error, writerList, postDate, postContent } = this.state;

        if (error || !writerList) return <h1>Error or not loaded, TODO: write this part better</h1>;

        console.log(this.state);

        return <div>
            {this.renderPostType()}
            {this.renderWriterSelect(writerList)}
            <fieldset>
                <TextField type="date" helperText="Date of day" helperTextPersistent={true} box={true} onChange={HIValue(this, "postDate")} value={postDate} />

                <TextField rows={10} textarea={true} helperText="Post content" helperTextPersistent={true} box={true} fullwidth={true} onChange={HIValue(this, "postContent")} value={postContent} />
            </fieldset>

            <Button onClick={this.uploadPost}>{this.props.postId ? "Update post" : "Create post"}</Button>

        </div>
    }
}