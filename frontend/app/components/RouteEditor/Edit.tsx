import { h, render, Component } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import Switch from 'preact-material-components/Switch';
import Button from 'preact-material-components/Button';
import TextField from "preact-material-components/TextField";
import Select from "preact-material-components/Select";

import { IDefProps } from "../../iface";
import Map from "./Map";
import RoutePointList from "./PointList";

import * as API from "../../common/ifaces";

interface EditProps extends IDefProps {
    createNew: boolean;
    idRoute?: string;
}

interface EditStat {
    routePoints: API.RoutePoint[];
    txDetail: string;
    transportType: string;
    comment: string;
}

export default class RouteEdit extends Component<EditProps, EditStat> {
    private route: boolean;

    constructor() {
        super();
        this.state = {
            routePoints: [],
            txDetail: "",
            transportType: "hitch",
            comment: ""
        };

        this.mapClick = this.mapClick.bind(this);
        this.routeSwitchChanged = this.routeSwitchChanged.bind(this);
        this.removePointClicked = this.removePointClicked.bind(this);
        this.detailOnInput = this.detailOnInput.bind(this);
        this.commentChanged = this.commentChanged.bind(this);
        this.transportChange = this.transportChange.bind(this);
        this.savedata = this.savedata.bind(this);
        this.route = false;
    }

    ////////////////////
    /* EVENT HANDLERS */
    ////////////////////
    mapClick(evt: LeafletMouseEvent) {
        let newPoint: API.RoutePoint = {
            mode: this.route ? API.RoutePointMode.Routed : API.RoutePointMode.ByHand,
            latlng: evt.latlng,
            extRouted: []
        };

        if (newPoint.mode == API.RoutePointMode.Routed) {
            let body = {
                from: this.state.routePoints[this.state.routePoints.length - 1],
                to: newPoint
            };

            fetch("/api/routes/routeBetween", {
                method: "POST",
                cache: "no-cache",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body)
            }).then((res) => {
                return res.json();
            }).then((res: API.APIResponse<API.RespRoute>) => {
                newPoint.extRouted = res.data;
                this.setState((oldstate) => {
                    return {
                        routePoints: [...oldstate.routePoints, newPoint]
                    }
                });
            }).catch((err) => {
                console.log("Error fetching route", err);
            });

        } else {
            this.setState((oldstate) => {
                return {
                    routePoints: [...oldstate.routePoints, newPoint]
                }
            });
        }
    }

    savedata() {
        fetch("/api/routes/route", { 
            method: "POST",
            cache: "no-cache",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(this.state)
        }).then( (res) => { 
            return res.json();
        }).then( (res: API.APIResponse<API.RespID>) => {
            route(`/routes/edit/${res.data}`);
        });
    }

    routeSwitchChanged(evt: any) {
        console.log(evt.srcElement.checked);
        this.route = evt.srcElement.checked;
    }

    removePointClicked(idx: number) {
        this.setState((oldstate) => {
            return {
                routePoints: [...oldstate.routePoints.slice(0, idx), ...oldstate.routePoints.slice(idx + 1)]
            }
        });
    }

    detailOnInput(e: any) {
        this.setState({ txDetail: e.target.value });
    }

    transportChange(e: any) {
        this.setState( {transportType: e.target.value});
    }

    commentChanged(e: any) {
        this.setState({ comment: e.target.value });
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        if (this.props.createNew)
            return <div>
                <h1>Create new</h1>
                <div>
                    <TextField onInput={this.detailOnInput} value={this.state.txDetail} helperText="Short description" helperTextPersistent={true} />
                    <Select onChange={this.transportChange} value={this.state.transportType}>
                        {Object.keys(API.RouteTransportMethod).map(itm => (<Select.Item value={itm}>{itm}</Select.Item>))}
                    </Select>
                    <Button onClick={this.savedata}>Save!</Button> <Button>Load GPX</Button> <br /><br />
                    <TextField onInput={this.commentChanged} value={this.state.comment} textarea={true} />
                    <hr />
                </div>
                <table><tr><td style="vertical-align: top">
                    <Map onclick={this.mapClick} points={this.state.routePoints} /></td><td style="vertical-align: top">
                        Route: <Switch onChange={this.routeSwitchChanged} /> <br />
                        <RoutePointList points={this.state.routePoints} onRemoveClick={this.removePointClicked} /></td></tr></table>
            </div>
        else
            return <h1>Edit a route</h1>
    }
}