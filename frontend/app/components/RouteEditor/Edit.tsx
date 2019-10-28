import { h } from "preact";
import { route } from "preact-router";
import { LeafletMouseEvent } from "leaflet";

// components
import Switch from 'preact-material-components/Switch';
import Button from 'preact-material-components/Button';
import TextField from "preact-material-components/TextField";
import Select from "preact-material-components/Select";

import { IDefProps, IDefState } from "../../iface";
import { HIValue, HIChecked } from "../../lib/onchange";

import BaseComponent from "../BaseComponent";
import Map from "./Map";
import RoutePointList from "./PointList";

import * as API from "../../api/main";

enum WorkingMode {
    newPoint, insertBetween, noOp
}

interface IRouteEditProps extends IDefProps {
    idRoute?: string;
}

interface IRouteEditState extends IDefState {
    // properties of SavedRoute
    routeVersion: number;
    dayTaken: string;
    descript: string;
    comment: string;
    transportType: API.RouteTransportMethod;
    routePoints: API.RoutePoint[];

    // for working component
    workMode: WorkingMode;
    pointRouting: boolean;
}

export default class RouteEdit extends BaseComponent<IRouteEditProps, IRouteEditState> {
    constructor(p: IRouteEditProps, ctx: any) {
        super(p, ctx);
        this.state = {
            routeVersion: 0,
            dayTaken: "",
            descript: "",
            comment: "",
            transportType: API.RouteTransportMethod.walk,
            routePoints: [],
            pointRouting: false,
            workMode: WorkingMode.noOp
        };
    }

    /*
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
    }*/

    fetchRoute(id: string) {
        this.download("route data", API.Urls.Routes.p("specific", id))
        .then( (res: API.SavedRoute) => {
            this.setState({
                comment: res.comment,
                dayTaken: res.dayTaken,
                descript: res.descript,
                routePoints: res.routePoints,
                transportType: res.transportType
            });
        } );
    }

    saveData() {
        let body = {
            comment: this.state.comment,
            dayTaken: this.state.dayTaken,
            descript: this.state.descript,
            routePoints: this.state.routePoints,
            transportType: this.state.transportType
        };

        let URL: string;
        let method: string;

        if (this.props.idRoute) {
            URL = API.Urls.Routes.p("specific", this.props.idRoute);
            method = "PATCH";
        } else {
            URL = API.Urls.Routes.p("all");
            method = "POST";
        }

        this.download("saving route data", URL, method, body)
        .then( (res: API.RespID) => {
            if (res)
                route(`/routes/${res}`);
            
            this.displayMessage(this.props.idRoute ? "Updated" : "Created", "Operation has finished successfully");
        } );
    }

    componentDidMount() {
        this.componentDidUpdate({"idRoute": ""});
    }

    componentDidUpdate(oldProps: IRouteEditProps) {
        if (oldProps.idRoute != this.props.idRoute && this.props.idRoute) {
            this.fetchRoute(this.props.idRoute);
        }
    }


    mapClick(evt: LeafletMouseEvent) {

    }


    /*
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
    
        removePointClicked(idx: number) {
            this.setState((oldstate) => {
                return {
                    routePoints: [...oldstate.routePoints.slice(0, idx), ...oldstate.routePoints.slice(idx + 1)]
                }
            });
        }*/


    r() {
        const { comment, dayTaken, descript, transportType, pointRouting, routePoints, routeVersion, workMode } = this.state;

        return <div>
            <h1>Route editor</h1>
            <fieldset>
                <TextField onInput={HIValue(this, "descript")} value={descript} helperText="Description for orientation" helperTextPersistent={true} /> <br />
                <TextField onInput={HIValue(this, "comment")} value={comment} helperText="Comment, that will appear in book" helperTextPersistent={true} /> <br />
                <TextField type="date" onInput={HIValue(this, "dayTaken")} value={dayTaken} helperText="Date" helperTextPersistent={true} /> <br />

                <Select onChange={HIValue(this, "transportType")} value={transportType}>
                    {Object.keys(API.RouteTransportMethod).map((itm) => {
                        let key = (API.RouteTransportMethod as any)[itm];
                        return <Select.Item value={key}>{itm}</Select.Item>
                    })}
                </Select>
                <Button onClick={this.saveData}>Save!</Button>
                <Button>Load GPX</Button>
            </fieldset>
            <table><tr>
                <td style="vertical-align: top">
                    <Map onclick={this.mapClick} points={this.state.routePoints} />
                </td>
                <td style="vertical-align: top">
                    Route: <Switch onChange={HIChecked(this, "pointRouting")} /> <br />
                    <RoutePointList points={this.state.routePoints}  />
                </td>
            </tr></table>

        </div>
    }
}