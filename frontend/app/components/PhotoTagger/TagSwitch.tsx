import { h, render, Component } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

interface TagswitchProps extends IDefProps {
    tag: API.PhotoTag,
    set: API.PhotoSetTag
}

interface TagswitchStat {   
}

export default class TagSwitch extends Component<TagswitchProps, TagswitchStat> {
    constructor() {
        super();
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        const { tag, set } = this.props;

        let tagid = `l_tag_${tag.tagName}`;
        let info = tag.translation ? tag.translation : tag.tagName;
        let checked = false;
        if (set != null) {
            checked = true;
            if (set.subtag) 
                info = `${info} (${set.subtag})`;
        }

        return <div class="cbox">
            <input type="checkbox" id={tagid} checked={checked} />
            <label for={tagid}>
                <span class="asckeyinfo">{tag.tagKey}: </span>
                {info}
            </label>
        </div>;
    }
}