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
    error: string;
    nextId: string;
    prevId: string;
}

export default class DirList extends Component<TaggerProps, TaggerStats> {
    constructor() {
        super();
        this.state = {
            loaded: false,
            tags: null,
            comment: null,
            error: null,
            nextId: null,
            prevId: null
        };

        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);
    }

    componentDidMount() {
        this.componentDidUpdate({photoId: null});
    }

    componentDidUpdate(prevProps: TaggerProps) {
        if (prevProps.photoId == this.props.photoId) return;

        // fetch photo metadata
        fetch(`/api/photos/photo/${this.props.photoId}/info`, {
            cache: "no-cache"})
        .then(res => res.json())
        .then( (res: API.APIResponse<API.RespPhotoInfo>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({loaded: false, error: res.resultDetail });
            } else {
                this.setState({loaded: true, error: null, comment: res.data.comment, tags: {...res.data.tags} })
            }
        }).catch( (ex: any) => {
            this.setState( {loaded: false, error: ex.toString()});
        })

        //fetch next and previous photo IDs
        fetch(`/api/photos/photo/${this.props.photoId}/around`)
        .then(res => res.json())
        .then( (res: API.APIResponse<API.RespPhotoAround>) => {
            if (res.result == API.APIResponseResult.Fail) {
                console.error("Server error while receiving 'around photo' info, but not fatal", res.resultDetail);
            } else {
                this.setState({nextId: res.data.next, prevId: res.data.prev});
            }
        }).catch( (ex: any) => {
            console.error("Error while receiving 'around photo' info, but not fatal", ex);
            this.setState({nextId: null, prevId: null});
        });
    }

    onCommentChange(evt: Event): void {
        this.setState( { comment: (evt.target as HTMLInputElement).value });
    }

    addTag(tag: API.PhotoTag, subtag: string): void {
//        console.log(`Tagger::addTag(${tag._id}/${tag.tagName}, ${subtag})`);
        this.setState( (oldstate) => {
            let newtags: API.PhotoTagset = {...oldstate.tags};
            newtags[tag._id] = {subtag: subtag};
            return { tags: newtags};
        });
    }

    removeTag(tag: API.PhotoTag): void {
//        console.log(`Tagger::removeTag(${tag._id}/${tag.tagName})`);

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
        const {loaded, error, comment, tags, prevId, nextId} = this.state;
        
        if(!loaded && error == null) {
            return <h1>Loading photo info ...</h1>
        } else if (!loaded && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && loaded) {
            return <h1>Tagger pseudoWTF state</h1>;
        } else {
            let prev = prevId ? <a href={`/photos/tag/${prevId}`}>&lt;&lt;</a> : undefined;
            let next = nextId ? <a href={`/photos/tag/${nextId}`}>&gt;&gt;</a> : undefined;
            return <div>
                    <TagSwitches setTags={tags} onTagAdd={this.addTag} onTagRemove={this.removeTag} />
                    <div class="descript"><input type="text" value={comment} onInput={this.onCommentChange} /></div>
                    <img src={`/api/photos/photo/${this.props.photoId}/thumb`} />

                    <div class="navig">
                        {prev} {next}
                    </div>
                </div>
        }
        
    }
}