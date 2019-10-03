import { h, render, Component } from "preact";
import { route } from "preact-router";

// components
import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

import TagSwitches from "./TagSwitches";

interface TaggerProps extends IDefProps {
    photo: string;
}

interface TaggerStats {
    photoInfo: API.Photo,
    error: string
}

export default class DirList extends Component<TaggerProps, TaggerStats> {
    constructor() {
        super();
        this.state = {
            photoInfo: null,
            error: null
        };
    }

    componentDidMount() {
        fetch(`/api/photos/photo/${this.props.photo}/info`, {
            method: "GET",
            cache: "no-cache"})
        .then(res => res.json())
        .then( (res: API.APIResponse<API.Photo>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({photoInfo: null, error: res.resultDetail });
            } else {
                this.setState({photoInfo: res.data, error: null })
            }
        }).catch( (ex: any) => {
            this.setState( {photoInfo: null, error: ex.toString()});
        })
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        let info = this.state.photoInfo;
        let error = this.state.error;

        if(info == null && error == null) {
            return <h1>Loading photo info ...</h1>
        } else if (info == null && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && info != null) {
            return <h1>Tagger WTF state</h1>;
        } else {
            return <div>
                    <TagSwitches setTags={info.tags} />
                    <img src={`/api/photos/photo/${this.props.photo}/thumb`} />
                </div>
        }
        
    }
}