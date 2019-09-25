import { h, render } from "preact";
import { Component } from "preact";
import { LeafletMouseEvent } from "leaflet";


import Switch from 'preact-material-components/Switch';
import Button from 'preact-material-components/Button';
import Radio from 'preact-material-components/Radio';

import { IDefProps } from "../iface";
import Map from "./Map";

import * as API from "../common/ifaces";

interface IREEProps extends IDefProps {
    createNew: boolean;
    idRoute?: string;
}

interface IREEStat {
    routePoints: API.RoutePoint[];
}

export default class RouteEditorEdit extends Component<IREEProps, IREEStat> {
    private route: boolean;

    constructor() {
        super();
        this.state = {
            routePoints: []
        };

        this.mapClick = this.mapClick.bind(this);
        this.routeSwitchChanged = this.routeSwitchChanged.bind(this);
        
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
                from:  this.state.routePoints[this.state.routePoints.length - 1],
                to: newPoint
            };

            fetch("/api/routes/routeBetween", {
                method: "POST", 
                cache: "no-cache", 
                headers: { "content-type": "application/json" }, 
                body: JSON.stringify(body)}).then( (res) => {
                    return res.json();
                }).then( (res: API.APIResponse<API.APIResponseRoute>) => {
                    newPoint.extRouted = res.data;
                    this.setState((oldstate) => {
                        return {
                            routePoints: [...oldstate.routePoints, newPoint]
                        }
                    });
                }).catch( (err) => {
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

    routeSwitchChanged(evt: any) {
        console.log(evt.srcElement.checked);
        this.route = evt.srcElement.checked;
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////
    render() {
        if (this.props.createNew)
            return <div>
                    <h1>Create new</h1>
                    <div>
                        Options <br />
                        Route: <Switch onChange={this.routeSwitchChanged} /> <br />
                        <Button>Load GPX</Button>

                        <hr />
                    </div>
                    <Map onclick={this.mapClick} points={this.state.routePoints} />
                </div>
        else 
            return <h1>Edit a route</h1>
    }
}