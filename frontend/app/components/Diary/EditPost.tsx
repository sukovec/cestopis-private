import { h } from "preact";
import { route } from "preact-router";

import BaseComponent from "../BaseComponent";

// components
import TextField from "preact-material-components/TextField";
import FormField from "preact-material-components/FormField";
import Radio from "preact-material-components/Radio";
import Button from "preact-material-components/Button";

import { IDefProps, IDefState } from "../../iface";
import * as API from "../../common/ifaces";
import { HIValue } from "../../lib/onchange";

interface EditPostProps extends IDefProps {
    postId?: string;
}

interface EditPostState extends IDefState {
    writerList: API.Writer[];

    selectedWriterId: string;
    selectedPostType: API.PostType;
    postDate: string;
    postContent: string;
}

export default class EditPost extends BaseComponent<EditPostProps, EditPostState> {
    constructor(props: EditPostProps, ctx: any) {
        super(props, ctx);
        this.state = {
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

        if (this.props.postId) {
            URL = URL + `/${this.props.postId}`;
            method = "PATCH";
        }

        let body: API.Post = {
            date: this.state.postDate,
            text: this.state.postContent,
            type: this.state.selectedPostType,
            writer: this.state.selectedWriterId
        };

        this.download("uploading post", URL, method, body)
        .then( (res: API.RespID) => {
            if (this.props.postId) {
                this.displayMessage("Success", "The post was successfully updated");
            } else {
                route(`/diary/${res}`);
                this.displayMessage("Success", "The post was successfully created");
            }
        });
    }

    fetchWriters() {
        this.download("writer list", "/api/writers").then((res: API.RespWriterList) => {
            this.setState({ writerList: res });
        });
    }

    fetchPost(id: string) {
        this.download("post data", `/api/diary/${id}`)
            .then((res: API.RespPost) => {
                this.setState({
                    postContent: res.text,
                    postDate: res.date,
                    selectedPostType: res.type,
                    selectedWriterId: res.writer
                });
            });
    }

    clearPost() {
        this.setState({
            postDate: "",
            postContent: "",
            selectedWriterId: null,
            selectedPostType: API.PostType.dayView
        });
    }

    componentDidMount() {
        this.fetchWriters();

        this.componentDidUpdate({ postId: "" });
    }

    componentDidUpdate(oldProps: EditPostProps) {
        if (this.props.postId != oldProps.postId) {
            if (!this.props.postId)
                this.clearPost();
            else
                this.fetchPost(this.props.postId);
        }
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

    r() {
        const { writerList, postDate, postContent } = this.state;
        if (!writerList) return <h1>Load first</h1>;
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