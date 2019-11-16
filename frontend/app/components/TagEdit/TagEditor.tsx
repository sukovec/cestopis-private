import { h } from "preact";
import { route } from "preact-router";

import { IDefProps, IDefState } from "../../iface";
import * as API from "../../api/main";

import Button from "preact-material-components/Button";
import TextField from "preact-material-components/TextField";
import Checkbox from "preact-material-components/Checkbox";

import BaseComponent from "../BaseComponent";
import { HIValue, HIChecked } from "../../lib/onchange";

interface TagEditProps extends IDefProps {
    tagId?: string
}

interface TagEditState extends IDefState {
    tagName: string;
    translation: string;
    subtags: API.PhotoSubTag[];
    tagKey: string;
    hidden: boolean;
}

export default class TagEditor extends BaseComponent<TagEditProps, TagEditState> {
    constructor(p: TagEditProps, ctx: any) {
        super(p, ctx);
        this.state = {
            tagName: "", 
            translation: "", 
            subtags: [],
            tagKey: "", 
            hidden: false
        };

        this.addSubtag = this.addSubtag.bind(this);
        this.deleteSubtag = this.deleteSubtag.bind(this);
        this.uploadTagData = this.uploadTagData.bind(this);
    }

    fetchTag(tagId: string) {
        this.download("tag", API.Urls.Tags.p("specific", tagId))
        .then( (res: API.PhotoTag) => {
            this.setState({tagName: res.tagName, subtags: res.subtags, translation: res.translation, tagKey: res.tagKey, hidden: res.hidden});
        });
    }

    uploadTagData() {
        const { tagName, translation, tagKey, hidden, subtags } = this.state;

        let create = this.props.tagId === "";

        let body: API.PhotoTag = {
            tagName: tagName, 
            translation: translation, 
            tagKey: tagKey,
            hidden: hidden,
            subtags: subtags
        };

        this.download("uploading tag", create ? API.Urls.Tags.p("taglist") : API.Urls.Tags.p("specific", this.props.tagId), create ? "POST" : "PATCH", body)
        .then( (res) => {
            let redir = create ? () => { route(`/tags/${res}`) } : undefined;
            this.displayMessage("Success", `The tag was ${create ? "created" : "updated"} successfully`, redir);
        });
    }

    clear() {
        this.setState({
            tagName: "", 
            translation: "", 
            subtags: [],
            tagKey: "", 
            hidden: false
        });
    }

    componentDidMount() {
        this.componentDidUpdate({tagId: ""});
    }

    componentDidUpdate(oldProps: TagEditProps) {
        if (oldProps.tagId != this.props.tagId) {
            this.fetchTag(this.props.tagId);
        }
    }

    addSubtag() {
        this.setState( (oldstate) => {
            let newst = oldstate.subtags ? oldstate.subtags.slice(0) : [];
            newst.push({tagName: "", translation: undefined});

            return { subtags: newst };
        });
    }

    deleteSubtag(idx: number) {
        this.setState( (oldstate) => {
            let newst = oldstate.subtags ? oldstate.subtags.filter( (_, i) => {return idx !== i;}) : [];

            return { subtags: newst };
        });
    }

    subtagChanged(index: number, key: keyof API.PhotoSubTag) {
        return (evt: Event) => {
            this.setState( (os) => {
                let newst = os.subtags;
                newst[index][key] = (evt.target as HTMLInputElement).value;;
                return { subtags: newst };
            });
        };
    }

    renderSubtag(itm: API.PhotoSubTag, idx: number) {
        return <div>
            <TextField value={itm.tagName} label="Tag name" onChange={this.subtagChanged(idx, "tagName")} />
            <TextField value={itm.translation} label="Translation" onChange={this.subtagChanged(idx, "translation")} />
            <Button onClick={()=> {this.deleteSubtag(idx);}}>Delete</Button>
        </div>;
    }

    r() {
        const { tagName, translation, tagKey, hidden, subtags } = this.state;

        return <div>
            <fieldset>
                <legend>Basic info</legend>
                <TextField value={tagName} label="Base tag name" onChange={HIValue(this, "tagName")} /> <br />
                <TextField value={translation} label="Translation" onChange={HIValue(this, "translation")} /> <br />
                <TextField value={tagKey} label="Tag key" onChange={HIValue(this, "tagKey")} /> <br />
                <label for="ishiddencb"><Checkbox onChange={HIChecked(this, "hidden")} checked={hidden} /> Hidden</label>
            </fieldset>
            
            <fieldset>
                <legend>Subtags</legend>
                {subtags ? subtags.map((itm, idx) => { return this.renderSubtag(itm, idx); }) : undefined }
                <hr />
                <Button onClick={this.addSubtag}>Add new subtag</Button>
            </fieldset>

            <Button onClick={this.uploadTagData}>Save!</Button>

        </div>
    }
}