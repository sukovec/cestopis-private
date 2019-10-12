import { h, Component } from "preact";

// components
import List from "preact-material-components/List";

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
    error: string
}

export default class PostList extends Component<PostListProps, IPostListState> {

    constructor() {
        super();
        this.state = {
            writers: null,
            postlist: null,
            error: null,
            loadedPosts: false,
            loadedWriters: false
        };
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

        return <a href={`/diary/${itm._id}`}><List.Item class={`diary_item_${itm.type}`}>
            <List.TextContainer>
                <List.PrimaryText>{itm.date}: {itm.text.substr(0, 120)}</List.PrimaryText>
                <List.SecondaryText>{wrt.fullName}</List.SecondaryText>
            </List.TextContainer>
            <List.ItemMeta>
                {itm.type}
            </List.ItemMeta>
        </List.Item></a>;
    }

    render() {
        const { loadedPosts, loadedWriters, error, postlist } = this.state;

        if (error) return <ErrorDisplay source="PostList" title="An error" error={error}>Something wrong happened</ErrorDisplay>;
        if (!loadedPosts && !loadedWriters) return <LoadingDisplay>writers and posts</LoadingDisplay>;
        if (!loadedWriters) return <LoadingDisplay>writers</LoadingDisplay>;
        if (!loadedPosts) return <LoadingDisplay>post</LoadingDisplay>;

        return <List two-line={true}>
            <List.Item><a href="/diary/create">Create new item</a></List.Item>
            {postlist.map(itm => this.renderPost(itm))}
        </List>;
    }
}