import { h, render, Component } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

interface PhotoListProps extends IDefProps {
    dir: string
}

interface PhotoListStats {
    photolist: API.RespPhotoList,
    error: string
}

export default class PhotoTaggerPhotolist extends Component<PhotoListProps, PhotoListStats> {
    constructor() {
        super();
        this.state = {
            photolist: null,
            error: null
        };
    }

    componentDidMount() {
        fetch(`/api/photos/photos/${this.props.dir}`, {
            method: "GET",
            cache: "no-cache"})
        .then(res => res.json())
        .then( (res: API.APIResponse<API.RespPhotoList>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({photolist: null, error: res.resultDetail });
            } else {
                this.setState({photolist: res.data, error: null })
            }
        });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        const {photolist, error } = this.state;

        if(photolist == null && error == null) {
            return <h1>Loading photo list ...</h1>
        } else if (photolist == null && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && photolist != null) {
            return <h1>PhotoList WTF state</h1>;
        } else {
            return <div>
                <a href="/photos/">Directory list</a>
                <ul>
                {photolist.map(itm => 
                    <a href={`/photos/tag/${itm}`}><img src={`/api/photos/photo/${itm}/thumb`} width={256} /></a>
                    )
                }
                </ul></div>
        }
        
    }
}