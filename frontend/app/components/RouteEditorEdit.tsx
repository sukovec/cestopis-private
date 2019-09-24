import { h, render } from "preact";
import { Component } from "preact";
import { LeafletMouseEvent } from "leaflet";

import Switch from 'preact-material-components/Switch';
import Button from 'preact-material-components/Button';

import { IDefProps } from "../iface";
import Map from "./Map";

interface IREEProps extends IDefProps {
    createNew: boolean;
    idRoute?: string;
}

interface IREEStat {
    routePoints: any[];
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
        if (this.route && this.state.routePoints.length >= 2) {
            let body = { 
                from:  this.state.routePoints[this.state.routePoints.length - 1],
                to: evt.latlng
            };

            fetch("/api/routes/routeBetween", {
                method: "POST", 
                cache: "no-cache", 
                headers: { "content-type": "application/json" }, 
                body: JSON.stringify(body)}).then( (res) => {
                    return res.json();
                }).then( (res) => {
                    this.setState( (oldstate) => {
                        let ret = {
                            routePoints: oldstate.routePoints.concat(res)
                        }

                        console.log("New data, looking like this:", ret);
                        return ret;
                    });

                }).catch( (err) => {
                    console.log("Error fetching lo");
                });
            
        } else {
            this.setState( (oldstate) => {
                return {
                    routePoints: [...oldstate.routePoints, evt.latlng]
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
                    </div>
                    <Map onclick={this.mapClick} points={this.state.routePoints} />
                </div>
        else 
            return <h1>Edit a route</h1>
    }
}