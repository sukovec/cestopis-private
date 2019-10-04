import { h, render, Component } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

import TagSwitch from "./TagSwitch";

interface TagswitchesProps extends IDefProps {
    setTags: API.PhotoTagset,
    onTagAdd?: (tag: API.PhotoTag, subtag: string) => void,
    onTagRemove?: (tag: API.PhotoTag) => void
}

interface TagswitchesStat {
    tagList: API.PhotoTag[];
    error: string
}

export default class TagSwitches extends Component<TagswitchesProps, TagswitchesStat> {
    constructor(props: TagswitchesProps) {
        super(props)

        this.state = {
            tagList: null,
            error: null
        };
    }

    hookKeys(tags: API.PhotoTag[]) {

    }

    componentDidMount() {
        //this.tagmap = {};
        fetch(`/api/photos/tags`, { cache: "no-cache"})
        .then(res => res.json())
        .then( (res: API.APIResponse<API.RespTagList>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({tagList: null, error: res.resultDetail });
            } else {
                this.setState({tagList: res.data, error: null })
                this.hookKeys(res.data);
            }
        }).catch( (ex: any) => {
            this.setState( {tagList: null, error: ex.toString()});
        })
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    tagChanged(tag: API.PhotoTag, newState: boolean, subtag?: string) {
 //       console.log(`TagSwitches::tagChanged(${tag._id}/${tag.tagName}, ${newState}, ${subtag})`);
        let isSet = this.props.setTags.hasOwnProperty(tag._id);

        if ((newState && isSet) || (!newState && !isSet)) {
 //           console.error("The supposed state change cannot be done, as it's already in wanted state");
            console.log(this.props);
            console.log(this.state);
            return;
        }

        if (newState) {
//            console.log("    TagSwitches::tagChanged: adding");
            if (this.props.onTagAdd) this.props.onTagAdd(tag, subtag);
        }
        else {
//            console.log("    TagSwitches::tagChanged: removing");
            if (this.props.onTagRemove) this.props.onTagRemove(tag);
        } 
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        const { tagList, error } = this.state;
        const { setTags } = this.props;

        if(tagList == null && error == null) {
            return <h1>Loading tag list</h1>
        } else if (tagList == null && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && tagList != null) {
            return <h1>Tagger WTF state</h1>;
        }

        return <div>{tagList.map((item => {
            if (item.hidden) return null;
            let cback = this.tagChanged.bind(this, item);
            return <TagSwitch tag={item} set={setTags[item._id]} onChange={cback} />
        }))}</div>;
    }
}