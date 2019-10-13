import { h, Component } from "preact";

import { IDefProps, IDefState } from "../../iface";
import * as API from "../../common/ifaces";

import BaseComponent from "../BaseComponent";

interface PhotoListProps extends IDefProps {
    dir: string
}

interface PhotoListStats extends IDefState {
    photolist: API.RespPhotoList,
}

export default class PhotoTaggerPhotolist extends BaseComponent<PhotoListProps, PhotoListStats> {
    constructor(p: PhotoListProps, ctx: any) {
        super(p, ctx);
        this.state = {
            photolist: null,
        };
    }

    fetchPhotoList(dir: string) {
        this.download("photo list", `/api/photos/photos/${dir}`)
            .then((res: API.RespPhotoList) => {
                this.setState({ photolist: res })
            });
    }

    componentDidMount() {
        this.componentDidUpdate({ dir: null });
    }

    componentDidUpdate(prevProps: PhotoListProps) {
        if (prevProps.dir == this.props.dir) return;

        this.fetchPhotoList(this.props.dir);

    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    r() {
        const { photolist } = this.state;
        if (!photolist) return <h1>Loading</h1>;
        return <div>
            <a href="/photos/">Directory list</a>
            <ul>
                {photolist.map(itm =>
                    <a href={`/photos/tag/${itm}`}><img src={`/api/photos/photo/${itm}/thumb`} width={256} /></a>
                )
                }
            </ul>
        </div>
    }
}