import { h, render, Component } from "preact";
import { IDefProps } from "../../iface";
import * as API from "../../api/main";


interface TagswitchProps extends IDefProps {
    tag: API.PhotoTag,
    set: API.PhotoSetTag,

    // events:

    onChange?: (newState: boolean, subtag?: string) => void
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

        if (this.onclick) this.props.onChange(target.checked);
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