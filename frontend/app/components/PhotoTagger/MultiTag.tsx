import { h } from "preact";

import BaseComponent from "../BaseComponent";
import { IDefState, IDefProps } from "../../iface";
import Button from "preact-material-components/Button";

import * as API from "../../api/ifaces";


interface IMultiTagProps extends IDefProps {
    dir: string;
    tag: string;
    subtag: string;
}

interface IMultiTagState extends IDefState {
    tagList: API.PhotoTag[];
    tagMap: Map<string, API.PhotoTag>;
    photoList: API.Photo[];
    photoMap: Map<string, API.Photo>;
    changes: Map<string, boolean>;
}

export default class MultiTag extends BaseComponent<IMultiTagProps, IMultiTagState> {
    constructor(p: IMultiTagProps, ctx: any) {
        super(p, ctx);
        this.state = {
            tagList: [], 
            tagMap: new Map(), 
            photoList: [], 
            photoMap: new Map(),
            changes: new Map()
        }

        this.updatePhotoTags = this.updatePhotoTags.bind(this);
    }

    fetchTagList() {
        this.download("taglist", `/api/photos/tags`)
            .then((res: API.RespTagList) => {
                let map = new Map<string, API.PhotoTag>();
                res.forEach(itm => map.set(itm._id, itm));

                this.setState({ tagList: res, tagMap: map });
            })
    }

    fetchPhotoList(dir: string) {
        this.download("photo list", `/api/photos/photos/${dir}?full=true`)
        .then( (res: API.RespPhotoListFull) => {
            let map = new Map<string, API.Photo>();
            res.forEach(itm => map.set(itm._id, itm));

            this.setState({
                photoList: res, 
                photoMap: map
            });
        });
    }

    havetag(photo: API.Photo, tag: API.PhotoTag) {
        return Boolean(photo.tags[tag._id]);
    }

    havefull(photo: API.Photo, tag: API.PhotoTag, subtag: string) {
        let havetag = this.havetag(photo, tag);
        return havetag && (!tag.subtags || photo.tags[tag._id].subtag == subtag);
    }

    createUpdateRequest(): API.MultiTagRequest {
        let selTag = this.state.tagMap.get(this.props.tag);
        let subTag = this.props.subtag;
        let req: API.MultiTagRequest = {};

        this.state.changes.forEach( (v, k) => {
            if (!v) return;

            let photo = this.state.photoMap.get(k);
            req[photo._id] = {}; // create empty request

            let havetag = this.havetag(photo, selTag);
            let havefull = this.havefull(photo, selTag, this.props.subtag);

            let tagobj: API.PhotoTagset = {};
            tagobj[selTag._id] = { subtag: subTag ? subTag : undefined };

            if (!havetag) { // does not have tag at all -> add
                req[photo._id].add = tagobj;
            } else if (havefull) { // have exactly the tag -> remove it
                req[photo._id].remove = tagobj;
            } else { // I have a tag, but other subtag -> change it
                req[photo._id].change = tagobj;
            }
        });

        return req;
    }

    updatePhotoTags() {
        let ch = this.createUpdateRequest();

        this.download("updating tags", "/api/photos/multitag", "PATCH", ch);
    }

    componentDidMount() {
        this.fetchTagList();
        this.componentDidUpdate({dir: "", tag: "", subtag: ""});
    }

    componentDidUpdate(oldProps: IMultiTagProps) {
        if (oldProps.dir != this.props.dir)
            this.fetchPhotoList(this.props.dir);

        if (oldProps.tag != this.props.tag || oldProps.subtag != this.props.subtag)
            this.setState({changes: new Map()});
    }

    makeChange(photoid: string) {
        this.setState( (os) => {
            let m = new Map(os.changes);
            let newv = os.changes.get(photoid);

            m.set(photoid, !newv);

            return { changes: m };
        });
    }

    ////////////// RENDER

    renderTag(tag: API.PhotoTag) {
            return <div>
                <h1>{tag.translation || tag.tagName}</h1>
                <a href={`/photos/multi/${this.props.dir}/${tag._id}`}> | JUST THIS | </a> 
                {(tag.subtags && tag.subtags.length > 0) && tag.subtags.map(itm => <a href={`/photos/multi/${this.props.dir}/${tag._id}/${itm.tagName}`}> | {itm.translation || itm.tagName} | </a>)}
            </div>
        
    }

    renderTagList() {
        return <div>{this.state.tagList.map(itm => this.renderTag(itm))}</div>
    }

    renderPhoto(photo: API.Photo, selTag: API.PhotoTag) {
        let havetag = this.havetag(photo, selTag);
        let havefull = this.havefull(photo, selTag, this.props.subtag);

        let change = Boolean(this.state.changes.get(photo._id));
        let cstate = change ? !havefull : havefull;

        let cls = "";
        if (cstate) {
            if (change)
                cls = "isselected";
            else
                cls = "isfulltag";
        } else {
            if (havefull)
                cls = "isremoved";
            else if (!havefull && havetag)
                cls = "isothersubtag";
            else 
                cls = "";
        }

        return <div class={`imgcheck ${cls}`} onClick={this.makeChange.bind(this, photo._id)}>
		    <label for={photo._id}><img src={`/api/photos/photo/${photo._id}/thumb`} width='175' alt={photo.comment} title={photo.comment} /></label>
		</div>

    }

    renderPhotoList() {
        let selTag = this.state.tagMap.get(this.props.tag);
        if (!selTag) return <h1>The tag ID does not exist?</h1>;

        let tagto = selTag.translation || selTag.tagName;
        if (this.props.subtag)
            tagto += "/" + this.props.subtag;

        return <div>
            <h1>MultiTag to {tagto}</h1>
            <div><Button onClick={this.updatePhotoTags}>MULTI TAG!</Button></div>
            {this.state.photoList.map(itm => this.renderPhoto(itm, selTag))}
            <div><Button onClick={this.updatePhotoTags}>MULTI TAG!</Button></div>
        </div>;
    }

    r() {
        return this.props.tag != "" ? this.renderPhotoList() : this.renderTagList();
    }
}