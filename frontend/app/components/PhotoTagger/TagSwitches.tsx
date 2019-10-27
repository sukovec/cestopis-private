import { h, render, Component } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import { IDefProps } from "../../iface";
import * as API from "../../api/main";


import TagSwitch from "./TagSwitch";

interface TagswitchesProps extends IDefProps {
    setTags: API.PhotoTagset,
    tagList: API.PhotoTag[];

    onTagAdd?: (tag: API.PhotoTag, subtag: string) => void,
    onTagRemove?: (tag: API.PhotoTag) => void
}

interface TagswitchesStat {}

export default class TagSwitches extends Component<TagswitchesProps, TagswitchesStat> {
    constructor(props: TagswitchesProps) {
        super(props)
        this.state = {        };
    }

    hookKeys(tags: API.PhotoTag[]) {
        // call this on received props or so
    }

    componentDidMount() {
    }

    tagChanged(tag: API.PhotoTag, newState: boolean, subtag?: string) {
        let isSet = this.props.setTags.hasOwnProperty(tag._id);

        if ((newState && isSet) || (!newState && !isSet)) {
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
        const { tagList, setTags } = this.props;

        return <div>{tagList.map((item => {
            if (item.hidden) return null; // TODO: make a possibility to see hidden tags
            let cback = this.tagChanged.bind(this, item);
            return <TagSwitch tag={item} set={setTags[item._id]} onChange={cback} />
        }))}</div>;
    }
}