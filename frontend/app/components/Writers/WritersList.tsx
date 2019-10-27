import { h, Component } from "preact";

// components
import List from "preact-material-components/List";

import BaseComponent from "../BaseComponent";

import { IDefProps, IDefState } from "../../iface";
import * as API from "../../api/main";




interface IWritersListProps extends IDefProps {
}

interface IWritersListState extends IDefState {
    list: API.RespWriterList,
}

export default class WritersList extends BaseComponent<IWritersListProps, IWritersListState> {
    constructor(p: IWritersListProps, ctx: any) {
        super(p, ctx);
        this.state = {
            list: null,
        };
    }

    fetchWriters() {
        this.download("writers", API.Urls.Writers.p("listall"))
        .then((res: API.RespWriterList) => {
            this.setState({ list: res })
        });
    }

    componentDidMount() {
        this.fetchWriters();
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    r() {
        const { list } = this.state;
        if (!list) return <h1>Not loaded</h1>;

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