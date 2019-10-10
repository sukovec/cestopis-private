import { h, Component } from "preact";

// components

import List from "preact-material-components/List";

import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";



interface WritersListProps extends IDefProps {
}

interface WritersListState {
    list: API.RespWriterList,
    error: string
}

export default class WritersList extends Component<WritersListProps, WritersListState> {
    constructor() {
        super();
        this.state = {
            list: null,
            error: null
        };
    }

    componentDidMount() {
        fetch(`/api/writers`, { method: "GET", cache: "no-cache" })
            .then(res => res.json())
            .then((res: API.APIResponse<API.RespWriterList>) => {
                if (res.result == API.APIResponseResult.Fail) {
                    this.setState({ list: null, error: res.resultDetail });
                } else {
                    this.setState({ list: res.data, error: null })
                }
            }).catch( (err) => {
                this.setState({list: null, error: err});
            });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        const { list, error } = this.state;

        if (list == null && error == null) {
            return <h1>Loading writers list ...</h1>
        } else if (list == null && error != null) {
            return <h1>Error: {error}</h1>
        } else if (error != null && list != null) {
            return <h1>WritersList WTF state</h1>;
        } else {
            return <div>
                <List>
                    <List.Item><a href={`/writers/new`}>New one</a></List.Item>
                    <List.Divider />
                    {list.map(itm =>
                        <List.Item><a href={`/writers/${itm._id}`}>{itm.fullName}</a></List.Item>
                    )
                    }
                </List>
                </div>
        }

    }
}