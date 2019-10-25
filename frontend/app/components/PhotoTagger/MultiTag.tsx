import { h } from "preact";

import BaseComponent from "../BaseComponent";
import { IDefState, IDefProps } from "../../iface";

import * as API from "../../common/ifaces";

interface IMultiTagProps extends IDefProps {
    dir: string;
    tag: string;
    subtag: string;
}

interface IMultiTagState extends IDefState {
    tagList: API.PhotoTag[];
    photoList: string[];
    photoMetadata: {[id: string]: API.Photo};
    loadedDir: string;
}

export default class MultiTag extends BaseComponent<IMultiTagProps, IMultiTagState> {
    constructor(p: IMultiTagProps, ctx: any) {
        super(p, ctx);
        this.state = {
            tagList: [], photoList: [], photoMetadata: {}, loadedDir: ""
        }
    }

    fetchTagList() {
        this.download("taglist", `/api/photos/tags`)
            .then((res: API.RespTagList) => {
                this.setState({ tagList: res })
            })
    }

    fetchPhotoList(dir: string) {
        this.download("photo list", `/api/photos/photos/${dir}`)
        .then( (res: API.RespPhotoList) => {
            this.setState({
                photoList: res, 
                photoMetadata: {},
                loadedDir: dir
            });
            res.forEach(itm => this.fetchPhotoMetadata(itm));
        });
    }

    fetchPhotoMetadata(id: string) {
        this.download(`photo ${id}`, `/api/photos/photo/${id}/info`)
        .then ((res: API.RespPhotoInfo) => {
            this.setState( (oldState) => {
                oldState.photoMetadata[res._id] = res;
            });
        });
    }

    componentDidMount() {
        this.fetchTagList();
        this.componentDidUpdate({dir: "", tag: "", subtag: ""});
    }

    componentDidUpdate(oldProps: IMultiTagProps) {
        if (this.props.tag != "" && this.state.loadedDir != this.props.dir)
            this.fetchPhotoList(this.props.dir);
    }

    ////////////// RENDER

    renderTag(tag: API.PhotoTag) {
            return <div>
                <h1>{tag.translation || tag.tagName}</h1>
                <a href={`/multi/${this.props.dir}/${tag.tagName}`}> | JUST THIS | </a> 
                {(tag.subtags && tag.subtags.length > 0) && tag.subtags.map(itm => <a href={`/multi/${this.props.dir}/${tag.tagName}/${itm.tagName}`}> | {itm.translation || itm.tagName} | </a>)}
            </div>
        
    }

    renderTagList() {
        return <div>{this.state.tagList.map(itm => this.renderTag(itm))}</div>
    }

    renderPhotoList() {
        return <h1>Poto list</h1>;
    }

    r() {
        return this.props.tag != "" ? this.renderPhotoList() : this.renderTagList();
    }
}