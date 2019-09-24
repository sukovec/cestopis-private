import { h, render } from "preact";
import { Component } from "preact";
import { IDefProps } from "../iface";

import * as L from "leaflet"
import layers from "../const/maplayers";

interface MapProps extends IDefProps {
    //view: [ number, number];
    //viewZoom: number;
    onclick?: (evt: L.LeafletMouseEvent) => void;
    points: L.LatLng[];
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

    componentDidMount() {
        this.map = L.map(this.base);
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
        console.log("Component updated");
        for (let i = 0; i < this.drawn.length; i++) {
            if (!this.drawn.hasOwnProperty(i)) continue;

            this.drawn[i].remove();
        }

        this.drawn.push(L.polyline(this.props.points, {color: "#ff00ff"}).addTo(this.map));
    }

    render() {
        return <div style="width: 512px; height: 512px"></div>;
    }
}