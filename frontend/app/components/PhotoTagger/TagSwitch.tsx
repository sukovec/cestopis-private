import { h, render, Component } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

interface TagswitchProps extends IDefProps {
    tag: API.PhotoTag,
    set: API.PhotoSetTag,

    // events:

    onChange?: (tag: API.PhotoTag, set: API.PhotoSetTag) => void
}

interface TagswitchStat {   
}

export default class TagSwitch extends Component<TagswitchProps, TagswitchStat> {
    constructor() {
        super();
        this.onclick = this.onclick.bind(this);
    }

    onclick(evt: MouseEvent) {
        let target = evt.target as HTMLInputElement;
        let st: API.PhotoSetTag = null;

        if (target.checked) {
            // let take it easy without setting sub-tags (right now) // TODO!
            st = {
                tag: this.props.tag.tagName // this should be ID, shouldn't it?
                // leave subtag forever empty
            }
        }

        if (this.onclick) 
            this.props.onChange(this.props.tag, st);
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
            <input type="checkbox" id={tagid} checked={checked} onClick={this.onclick} />
            <label for={tagid}>
                <span class="asckeyinfo">{tag.tagKey}: </span>
                {info}
            </label>
        </div>;
    }
}