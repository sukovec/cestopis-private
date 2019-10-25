import { h } from "preact";
import { route } from "preact-router"
// components
import { IDefProps, IDefState } from "../../iface";
import * as API from "../../common/ifaces";

import BaseComponent from "../BaseComponent";
import TagSwitches from "./TagSwitches";

interface TaggerProps extends IDefProps {
    photoId: string;
}

interface TaggerState extends IDefState {
    tags: API.PhotoTagset;
    tagList: API.PhotoTag[];
    comment: string;
    nextId: string;
    prevId: string;
    dir: string;
}

export default class DirList extends BaseComponent<TaggerProps, TaggerState> {
    constructor(p: TaggerProps, ctx: any) {
        super(p, ctx);
        this.state = {
            tags: null,
            tagList: null,
            comment: null,
            nextId: null,
            prevId: null,
            dir: null
        };

        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);
        this.saveAndProceed = this.saveAndProceed.bind(this);
    }

    fetchMetadata(photoId: string) {
        // fetch photo metadata
        this.download("photo metadata", `api/photos/photo/${photoId}/info/`)
            .then((res: API.RespPhotoInfo) => {
                this.setState({
                    comment: res.comment,
                    tags: { ...res.tags },
                    dir: res.folder
                });
            });
    }

    fetchAround(photoId: string) {
        this.download("prev/next photos", `/api/photos/photo/${photoId}/around`)
            .then((res: API.RespPhotoAround) => {
                this.setState({
                    nextId: res.next,
                    prevId: res.prev
                });
            });
    }

    fetchTags() {
        this.download("taglist", `/api/photos/tags`)
            .then((res: API.RespTagList) => {
                this.setState({ tagList: res })
            })
    }

    componentDidMount() {
        this.fetchTags();
        this.componentDidUpdate({ photoId: null });
    }

    componentDidUpdate(prevProps: TaggerProps) {
        if (prevProps.photoId == this.props.photoId) return;

        this.fetchMetadata(this.props.photoId);
        this.fetchAround(this.props.photoId);
    }

    saveAndProceed() {
        let body = {
            comment: this.state.comment,
            tags: this.state.tags
        };

        this.download("updating photo metadata", `/api/photos/photo/${this.props.photoId}/info`, "POST", body)
            .then((res: void) => {
                if (this.state.nextId)
                    route(`/photos/tag/${this.state.nextId}`);
                else
                    route(`/photos/dir/${this.state.dir}`);
            });
    }

    onCommentChange(evt: Event): void {
        this.setState({ comment: (evt.target as HTMLInputElement).value });
    }

    addTag(tag: API.PhotoTag, subtag: string): void {
        this.setState((oldstate) => {
            let newtags: API.PhotoTagset = { ...oldstate.tags };
            newtags[tag._id] = { subtag: subtag };
            return { tags: newtags };
        });
    }

    removeTag(tag: API.PhotoTag): void {
        this.setState((oldstate) => {
            let newtags: API.PhotoTagset = { ...oldstate.tags };
            delete newtags[tag._id];
            return { tags: newtags };
        });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    r() {
        const { comment, tags, tagList, prevId, nextId, dir } = this.state;

        if (!tagList || !dir) return <h1>Not loaded</h1>;

        let prev = prevId ? <a href={`/photos/tag/${prevId}`}>&lt;&lt;</a> : undefined;
        let next = nextId ? <a href={`/photos/tag/${nextId}`}>&gt;&gt;</a> : undefined;
        return <div>
            <TagSwitches tagList={tagList} setTags={tags} onTagAdd={this.addTag} onTagRemove={this.removeTag} />
            <div class="descript">
                <input type="text" value={comment} onInput={this.onCommentChange} />
                <input type='submit' value='yeah' onClick={this.saveAndProceed} />
            </div>
            <img src={`/api/photos/photo/${this.props.photoId}/thumb`} />

            <div class="navig">
                {prev}
                <a href={`/photos/dir/${dir}`}>DAY</a>
                <a href={`/photos/`}>ALL</a>
                {next}
            </div>
        </div>


    }
}