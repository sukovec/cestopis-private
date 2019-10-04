import { h, render, Component } from "preact";

// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

import TagSwitches from "./TagSwitches";

interface TaggerProps extends IDefProps {
    photoId: string;
}

interface TaggerStats {
    loaded: boolean, 
    tags: API.PhotoTagset;
    comment: string;
    error: string
}

export default class DirList extends Component<TaggerProps, TaggerStats> {
    constructor() {
        super();
        this.state = {
            loaded: false,
            tags: null,
            comment: null,
            error: null
        };

        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
    }

    componentDidMount() {
        fetch(`/api/photos/photo/${this.props.photoId}/info`, {
            method: "GET",
            cache: "no-cache"})
        .then(res => res.json())
        .then( (res: API.APIResponse<API.Photo>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({loaded: false, error: res.resultDetail });
            } else {
                this.setState({loaded: true, error: null, comment: res.data.comment, tags: {...res.data.tags} })
            }
        }).catch( (ex: any) => {
            this.setState( {loaded: false, error: ex.toString()});
        })
    }

    addTag(tag: API.PhotoTag, subtag: string) {
        console.log(`Tagger::addTag(${tag._id}/${tag.tagName}, ${subtag})`);
        this.setState( (oldstate) => {
            let newtags: API.PhotoTagset = {...oldstate.tags};
            newtags[tag._id] = {subtag: subtag};
            return { tags: newtags};
        });
    }

    removeTag(tag: API.PhotoTag) {
        console.log(`Tagger::removeTag(${tag._id}/${tag.tagName})`);

        this.setState( (oldstate) => {
            let newtags: API.PhotoTagset = {...oldstate.tags};
            delete newtags[tag._id];
            return { tags: newtags};
        });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        const {loaded, error, comment, tags} = this.state;
        
        if(!loaded && error == null) {
            return <h1>Loading photo info ...</h1>
        } else if (!loaded && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && loaded) {
            return <h1>Tagger pseudoWTF state</h1>;
        } else {
            return <div>
                    <TagSwitches setTags={tags} onTagAdd={this.addTag} onTagRemove={this.removeTag} />
                    <img src={`/api/photos/photo/${this.props.photoId}/thumb`} />
                </div>
        }
        
    }
}