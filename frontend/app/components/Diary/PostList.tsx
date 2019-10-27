import { h, Component } from "preact";
import { route } from "preact-router";

// components
import List from "preact-material-components/List";
import Button from "preact-material-components/Button";

// local compnents
import BaseComponent from "../BaseComponent";
import Dialog from "../Dialog";

import { IDefProps, IDefState } from "../../iface";
import * as API from "../../api/ifaces";


interface PostListProps extends IDefProps {
}

interface IPostListState extends IDefState {
    postlist: API.Post[],
    writers: { [id: string]: API.Writer },
    loadedPosts: boolean;
    loadedWriters: boolean;
    error: string,
    postToDelete: API.Post
}

export default class PostList extends BaseComponent<PostListProps, IPostListState> {
    constructor(p: PostListProps, ctx: any) {
        super(p, ctx);
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
        this.download("deleting post", `/api/diary/${this.state.postToDelete._id}`, "DELETE")
        .then( (res: void) => {
            this.setState({ postToDelete: null });
            this.fetchPosts();
        });
    }

    fetchWriters() {
        this.download("writers", "/api/writers")
            .then((res: API.RespWriterList) => {
                let hmap = res.reduce((prev, cur) => {
                    prev[cur._id] = cur;
                    return prev;
                }, {} as { [id: string]: API.Writer });
                this.setState({ writers: hmap });
            });
    }

    fetchPosts() {
        this.download("posts", "/api/diary")
            .then((res: API.RespPostList) => {
                this.setState({ postlist: res })
            });
    }

    componentDidMount() {
        this.fetchWriters();
        this.fetchPosts();
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
                <Button onClick={(evt: any) => {rmfunc(); evt.stopPropagation(); }}>Delete</Button>
            </List.ItemMeta>
        </List.Item>;
    }

    r() {
        const { postlist, postToDelete, writers} = this.state;
        if (!postlist || !writers) return <h1>Not loaded</h1>;
        
        let delDiag = undefined;
        if (postToDelete) {
            delDiag = <Dialog visible={true}>
                <Dialog.Header>Really delete?</Dialog.Header>
                <Dialog.Body>
                    Do you really want to delete post '{postToDelete._id}' <br />
                </Dialog.Body>
                <Dialog.Footer>
                    <Button onClick={this.deletePostStep2}>Delete!</Button>
                    <Button onClick={() => {this.setState({postToDelete:null})}}>No</Button>
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