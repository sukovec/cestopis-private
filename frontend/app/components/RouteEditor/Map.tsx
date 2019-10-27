import { h, render } from "preact";
import { Component } from "preact";
import { IDefProps } from "../../iface";

import * as L from "leaflet"
import layers from "../../const/maplayers";

import { RoutePoint, RoutePointMode, LatLng } from "../../api/main";

interface MapProps extends IDefProps {
    //view: [ number, number];
    //viewZoom: number;
    onclick?: (evt: L.LeafletMouseEvent) => void;
    points: RoutePoint[];
}

interface MapStat {

}

export default class Map extends Component<MapProps, MapStat> {
    private map: L.Map;
    private drawn: L.Layer[];

    constructor() {
        super();
        this.drawn = [];
        this.mouseClick = this.mouseClick.bind(this);
    }

    // HELPER
    drawRoutePoints() {
        let arr: LatLng[] = this.props.points.reduce( (acc, cur) => {
            if (cur.mode == RoutePointMode.ByHand) { acc.push(cur.latlng); return acc ; } 
            else return acc.concat(cur.extRouted);
        }, []);       
        this.drawn.push(L.polyline(arr, {color: "#ff00ff"}).addTo(this.map));

    }

    componentDidMount() {
        this.map = L.map(this.base as HTMLElement);
        this.map.setView([0, 0], 0);
//      map.setView(this.props.view, this.props.viewZoom);

        for(let i = 0; i < layers.length; i++) {
            if (!layers.hasOwnProperty(i)) continue;

            L.tileLayer(layers[i].url, layers[i]).addTo(this.map);
        }

        this.map.on("click", this.mouseClick);
    }

    mouseClick(evt: L.LeafletMouseEvent) {
        if (this.props.onclick)
            this.props.onclick(evt);

        console.log("Clicked!", evt);
    }

    componentDidUpdate(prevProps: MapProps, prevState: MapStat) {
        for (let i = 0; i < this.drawn.length; i++) {
            if (!this.drawn.hasOwnProperty(i)) continue;

            this.drawn[i].remove();
        }

        this.drawRoutePoints();
    }

    // RENDER
    render() {
        return <div style="width: 600px; height: 512px"></div>;
    }
}