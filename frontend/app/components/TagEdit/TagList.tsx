import { h } from "preact";

import { IDefProps, IDefState } from "../../iface";
import * as API from "../../api/main";

import Button from "preact-material-components/Button";
import List from "preact-material-components/List";

import BaseComponent from "../BaseComponent";
import { HIValue, HIChecked } from "../../lib/onchange";

interface TagListProps extends IDefProps {
    tagId?: string
}

interface TagListState extends IDefState {
   tagList: API.PhotoTag[];
}

export default class TagList extends BaseComponent<TagListProps, TagListState> {
    constructor(p: TagListProps, ctx: any) {
        super(p, ctx);
        this.state = {
            tagList: []
        };
    }

    fetchTagList() {
        this.download("tag", API.Urls.Tags.p("taglist"))
        .then( (res: API.RespTagList) => {
            this.setState({tagList: res});
        });
    }

    componentDidMount() {
        this.fetchTagList();
    }

    renderItem(itm: API.PhotoTag) {
        return <List.LinkItem href={`/tags/${itm._id}`}>
            <List.TextContainer>
                <List.PrimaryText>{itm.tagName} ({itm.translation})</List.PrimaryText>
                <List.SecondaryText>Hidden: {itm.hidden} | Subtags: {itm.subtags ? itm.subtags.length : "none"}</List.SecondaryText>
            </List.TextContainer>
            <List.ItemMeta>
                <Button>Delete</Button>
            </List.ItemMeta>
        </List.LinkItem>;
    }

    r() {
        const { tagList } = this.state;

        return <div><h1>Tag list</h1><List two-line={true}>
            {tagList.map( itm => this.renderItem(itm))}
        </List>
        </div>
    }
}