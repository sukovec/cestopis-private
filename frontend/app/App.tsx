import { h, render } from "preact";
import { Router, route } from "preact-router";
import { createHashHistory } from "history";

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';

function route_articles() {
	route("articles");
}

function route_routes() {
	route("routes");
}

export function App(props: any) {
	return <div id="app">
		<div id="menu">
			<Button ripple raised onclick={route_articles}>Articles</Button>
			<Button ripple raised onclick={route_routes}>Routes</Button>
		</div>
		<Router history={createHashHistory()}>
			<h1 path="articles">Artikly</h1>
			<h1 path="routes">Routy</h1>
		</Router>
	</div>;
}
