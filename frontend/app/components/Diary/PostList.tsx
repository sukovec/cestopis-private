import { h, Component } from "preact";

// components
import List from "preact-material-components/List";

import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

interface PostListProps extends IDefProps {
}

interface IPostListState {
    postlist: API.Post[],
    error: string
}

export default class PostList extends Component<PostListProps, IPostListState> {

    constructor() {
        super();
        this.state = {
            postlist: null,
            error: null
        };
    }

    componentDidMount() {
        fetch("/api/diary")
        .then(res => res.json())
        .then( (res: API.APIResponse<API.RespPostList>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({postlist: null, error: res.resultDetail });
            } else {
                this.setState({postlist: res.data, error: null })
            }
        });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////

    renderPost(itm: API.Post) {
        return <a href={`/diary/${itm._id}`}><List.Item>
            <List.TextContainer>
                <List.PrimaryText>{itm.text}</List.PrimaryText>
                <List.SecondaryText>Name of author</List.SecondaryText>
            </List.TextContainer>
            <List.ItemMeta>
                META
            </List.ItemMeta>
        </List.Item></a>;
    }

    render() {
        let plist = this.state.postlist;
        let error = this.state.error;

        if(plist == null && error == null) {
            return <h1>Loading posts ...</h1>
        } else if (plist == null && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && plist != null) {
            return <h1>PostList WTF state</h1>;
        } else {
            return <List two-line={true}>
                {plist.map(this.renderPost)}
                </List>;
        }
        
    }
}