import { h, Component } from "preact";
import { route } from "preact-router";

// components
import FormField from "preact-material-components/FormField";
import Radio from "preact-material-components/Radio";

import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";
import { HIValue } from "../../lib/onchange";

interface EditPostProps extends IDefProps {
    postId?: string;
}

interface EditPostState {
    error: any;
    writerList: API.Writer[];

    selectedWriterId: string;
    selectedPostType: API.PostType;
    date: string;
}

export default class EditPost extends Component<EditPostProps, EditPostState> {
    private onDateChange: (evt: Event) => void;
    constructor() {
        super();
        this.state = {
            error: null,
            writerList: null,
            date: "",
            selectedWriterId: null,
            selectedPostType: API.PostType.dayView
        };
    }

    fetchWriters() {
        fetch(`/api/writers/`)
        .then(res => res.json())
        .then( (res: API.APIResponse<API.RespWriterList>) => {
            if (res.result == API.APIResponseResult.Fail) {
                this.setState({error: res.resultDetail, writerList: null});
            } else {
                this.setState({writerList: res.data});
            }
        })
        .catch( (err) => {
            this.setState({error: err, writerList: null});
        });
    }

    componentDidMount() {
        this.fetchWriters();

        this.componentDidUpdate({postId: ""});
    }

    componentDidUpdate(oldProps: EditPostProps) {

    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////

    renderPostType() {
        let ptypes = [API.PostType.budget, API.PostType.dayView, API.PostType.tiptrick];

        return <fieldset onChange={HIValue(this, "selectedPostType")}>
            {ptypes.map( itm => <FormField><Radio name="ptypesx" value={itm} checked={itm == this.state.selectedPostType} />{itm}</FormField>)}
            </fieldset>;
    }

    renderWriterSelect(wrts: API.Writer[]) {
        return <fieldset onChange={HIValue(this, "selectedWriterId")}>
            {wrts.map( itm => <FormField><Radio name="writerselect" value={itm._id} checked={itm._id == this.state.selectedWriterId} />{itm.fullName}</FormField>)}
            </fieldset>;
    }

    render() {
        const {error, writerList, date} = this.state;

        if (error || !writerList) return <h1>Error or not loaded, TODO: write this part better</h1>;

        console.log(this.state);

        return <div>
                {this.renderPostType()}
                {this.renderWriterSelect(writerList)}
            </div>
    }
}