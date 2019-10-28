import { h, VNode } from "preact";
import { route } from "preact-router";
// components
import Button from 'preact-material-components/Button';
import List from 'preact-material-components/List';

import { IDefProps, IDefState } from "../../iface";

import Dialog from "../Dialog";
import BaseComponent from "../BaseComponent";

import * as API from "../../api/main";

interface IRouteListProps extends IDefProps {
}

interface IRouteListState extends IDefState {
    routes: API.SavedRouteDescription[];
    routeToDelete: API.SavedRouteDescription;
}

export default class RouteEdit extends BaseComponent<IRouteListProps, IRouteListState> {
    constructor(p: IRouteListProps, ctx: any) {
        super(p, ctx);
        this.state = {
            routes: [],
            routeToDelete: undefined
        }

        this.removeRouteStep2 = this.removeRouteStep2.bind(this);
    }

    fetchRoutes() {
        this.download("saved route list", API.Urls.Routes.p("all"))
            .then((res: API.RespRouteList) => {
                this.setState({ routes: res });
            });
    }

    componentDidMount() {
        this.fetchRoutes();
    }

    removeRouteStep1(route: API.SavedRouteDescription) {
        this.setState({ routeToDelete: route });
    }

    removeRouteStep2() {
        this.download("deleting route", API.Urls.Routes.p("specific", this.state.routeToDelete._id), "DELETE")
            .then((res: void) => {
                this.setState({ routeToDelete: null });
                this.fetchRoutes();
            });

    }

    renderDayDivider(day: string) {
        return <List.Item class="day-divider">
            <h1>{day}</h1>
        </List.Item>
    }

    renderDeleteDialog() {
        return <Dialog visible={true}>
            <Dialog.Header>Really delete?</Dialog.Header>
            <Dialog.Body>
                Do you really want to delete post '{this.state.routeToDelete._id}' <br />
            </Dialog.Body>
            <Dialog.Footer>
                <Button onClick={this.removeRouteStep2}>Delete!</Button>
                <Button onClick={() => { this.setState({ routeToDelete: null }) }}>No</Button>
            </Dialog.Footer>
        </Dialog>;
    }

    renderItem(item: API.SavedRouteDescription) {
        let link = `/routes/${item._id}`;
        let rmfunc = this.removeRouteStep1.bind(this, item);
        return <List.Item onClick={() => { route(link) }}>
            <List.TextContainer>
                <List.PrimaryText>{item.dayTaken}: {item.descript}</List.PrimaryText>
                <List.SecondaryText>{item.comment.substr(0, 250)}</List.SecondaryText>
            </List.TextContainer>
            <List.ItemMeta>
                <Button onClick={(evt: any) => { rmfunc(); evt.stopPropagation(); }}>Delete</Button>
            </List.ItemMeta>
        </List.Item>;
    }

    renderList() {
        const { routes } = this.state;

        let ret: VNode[] = [];

        let lastDay = null;
        for (let rt = 0; rt < routes.length; rt++) {
            if (routes[rt].dayTaken !== lastDay) {
                ret.push(this.renderDayDivider(routes[rt].dayTaken));
                lastDay = routes[rt].dayTaken;
            }

            ret.push(this.renderItem(routes[rt]));
        }

        return ret;
    }

    r() {
        let deldiag = null;
        if (this.state.routeToDelete)
            deldiag = this.renderDeleteDialog();

        return <div>
            {deldiag}
            <List>
                <List.Item><a href={`/routes/create`}>Create new route</a></List.Item>
                <List.Divider />
                {this.renderList()}
            </List>
        </div>
    }
}

/*

        */