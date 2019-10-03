import { h, render, Component } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

import TagSwitch from "./TagSwitch";

interface TagswitchesProps extends IDefProps {
    setTags: API.PhotoSetTag[];
}

interface TagswitchesStat {
    setTags: { [id: string]: API.PhotoSetTag}, // do it here on in tthe parent?
    // fuck, I don't know
    // maybe I should reconsider PhotoSetTag[] to PhotoSetTags: { [_id]: { set-subtag-name, whatever }}
    // oh yeah, I will do next time
    // go to sleep and don't forget to do it next time
    // so: change it from array to map-object
    // don't forget to rewrite database-convertor (with inifile)
    // but still try to think about it little bit (is it even good idea?)
    // I think it is (unlike not-using classic database)
    /// buena noche
    tagList: API.PhotoTag[];
    error: string
}

export default class TagSwitches extends Component<TagswitchesProps, TagswitchesStat> {
    constructor(props: TagswitchesProps) {
        super(props)

        let stags = props.setTags.reduce((prev:any, cur) => {
            prev[cur.tag] = cur;
            return prev;
        }, {});

        this.state = {
            setTags: stags,
            tagList: null,
            error: null
        };
    }

    componentDidMount() {
        fetch(`/api/photos/tags`, { cache: "no-cache"})
        .then(res => res.json())
        .then( (res: API.APIResponse<API.PhotoTag[]>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({tagList: null, error: res.resultDetail });
            } else {
                this.setState({tagList: res.data, error: null })
            }
        }).catch( (ex: any) => {
            this.setState( {tagList: null, error: ex.toString()});
        })
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        const { tagList, setTags, error } = this.state;

        if(tagList == null && error == null) {
            return <h1>Loading tag list</h1>
        } else if (tagList == null && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && tagList != null) {
            return <h1>Tagger WTF state</h1>;
        }

        return <div>{tagList.map((item => {
            if (item.hidden) return null;
            return <TagSwitch tag={item} set={setTags[item.tagName]} />
        }))}</div>;
    }
}