import { h, Component } from "preact";
import { route } from "preact-router";

// components
import List from "preact-material-components/List";
import Button from "preact-material-components/Button";
import Dialog from "preact-material-components/Dialog";

// local components
import ErrorDisplay from "../ErrorDisplay";
import LoadingDisplay from "../LoadingDisplay";

import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

interface PostListProps extends IDefProps {
}

interface IPostListState {
    postlist: API.Post[],
    writers: { [id: string]: API.Writer },
    loadedPosts: boolean;
    loadedWriters: boolean;
    error: string,
    postToDelete: API.Post
}

export default class PostList extends Component<PostListProps, IPostListState> {

    constructor() {
        super();
        this.state = {
            writers: null,
            postlist: null,
            error: null,
            loadedPosts: false,
            loadedWriters: false,
            postToDelete: null
        };

        this.deletePostStep2 = this.deletePostStep2.bind(this);
    }


    deletePost(post: API.Post) { // being bound when rendering
        this.setState({ postToDelete: post });
    }

    deletePostStep2() {
        this.setState({ postToDelete: null});
    }

    fetchWriters() {
        fetch("/api/writers")
            .then(res => res.json())
            .then((res: API.APIResponse<API.RespWriterList>) => {
                if (res.result == API.APIResponseResult.Fail) {
                    this.setState({ postlist: null, error: res.resultDetail, loadedWriters: false });
                } else {
                    let hmap = res.data.reduce((prev, cur) => {
                        prev[cur._id] = cur;
                        return prev;
                    }, {} as { [id: string]: API.Writer });
                    this.setState({ writers: hmap, error: null, loadedWriters: true })
                }
            })
            .catch((err) => {
                this.setState({ error: err, loadedWriters: false })
            });
    }

    componentDidMount() {
        this.fetchWriters();

        fetch("/api/diary")
            .then(res => res.json())
            .then((res: API.APIResponse<API.RespPostList>) => {
                if (res.result == API.APIResponseResult.Fail) {
                    this.setState({ postlist: null, error: res.resultDetail, loadedPosts: false });
                } else {
                    this.setState({ postlist: res.data, error: null, loadedPosts: true })
                }
            })
            .catch((err) => {
                this.setState({ error: err, loadedPosts: false })
            });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////

    renderPost(itm: API.Post) {
        let wrt = this.state.writers[itm.writer];
        if (!wrt) wrt = {
            fullName: `Unknown writer id '${itm.writer}'`
        } as API.Writer;

        let link = `/diary/${itm._id}`;
        let rmfunc = this.deletePost.bind(this, itm);
        return <List.Item class={`diary_item_${itm.type}`} onClick={() => { route(link) }}>
            <List.ItemGraphic>{itm.type}</List.ItemGraphic>
            <List.TextContainer>
                <List.PrimaryText>{itm.date}: {itm.text.substr(0, 120)}</List.PrimaryText>
                <List.SecondaryText>{wrt.fullName}</List.SecondaryText>
            </List.TextContainer>
            <List.ItemMeta>
                <Button onClick={rmfunc}>Delete</Button>
            </List.ItemMeta>
        </List.Item>;
    }

    render() {
        const { loadedPosts, loadedWriters, error, postlist, postToDelete } = this.state;

        if (error) return <ErrorDisplay source="PostList" title="An error" error={error}>Something wrong happened</ErrorDisplay>;
        if (!loadedPosts && !loadedWriters) return <LoadingDisplay>writers and posts</LoadingDisplay>;
        if (!loadedWriters) return <LoadingDisplay>writers</LoadingDisplay>;
        if (!loadedPosts) return <LoadingDisplay>post</LoadingDisplay>;

        let delDiag = undefined;
        if (postToDelete) {
            delDiag = <Dialog onAccept={this.deletePostStep2}>
                <Dialog.Header>Really delete?</Dialog.Header>
                <Dialog.Body>
                    Do you really want to delete post '{postToDelete._id}' <br />
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.FooterButton accept={true}>Delete!</Dialog.FooterButton>
                    <Dialog.FooterButton cancel={true}>Delete!</Dialog.FooterButton>
                </Dialog.Footer>
            </Dialog>;
        }

        return <div>
            {delDiag}
            <List two-line={true}>
                <List.Item><a href="/diary/create">Create new item</a></List.Item>
                {postlist.map(itm => this.renderPost(itm))}
            </List>
        </div>;
    }
}