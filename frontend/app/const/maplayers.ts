export interface IMapLayer {
    name: string;
    attribution: string;
    url: string;
    minZoom?: number;
    maxZoom: number;
    maxNativeZoom?: number; 
    id?: string;
    accesToken?: string;
}

const osmAttr = '&copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';

export default [
    {
        name: "Mapy.cz",
        attribution: '&copy; <a href="https://www.seznam.cz/" target="_blank">Seznam.cz, a.s</a>, ' + osmAttr,
        url: 'https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}',
        minZoom: 2, maxZoom: 20, maxNativeZoom: 18
    }/*,
    {
        name: "OpenStreetMap",
        attribution: osmAttr,
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 20, maxNativeZoom: 19
    },
    {
        name: "MapBox",
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        url: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        maxZoom: 18,
        accessToken: "pk.eyJ1Ijoic3Vrb3ZlYyIsImEiOiJjazB4N3ozamwwMmRsM2Ntdjc3cnNrYmt1In0.ypidijFOgMYkHvVAUdCNpg",
        id: "mapbox.streets"
    }*/
];

/*
var layerOpenStreetMap = L.tileLayer(, {
	maxZoom: 20, maxNativeZoom: 19, attribution: osmAttr, id: 'OpenStreetMap'
});*/

``