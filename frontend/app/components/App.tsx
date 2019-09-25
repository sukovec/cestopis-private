import { h, render } from "preact";
import { Router, route } from "preact-router";
import { createHashHistory } from "history";

import Button from 'preact-material-components/Button';
import TopAppBar from 'preact-material-components/TopAppBar';
import 'preact-material-components/style.css';


import RouteEditor from "./RouteEditor";

function route_articles() {
	route("articles");
}

function route_routes() {
	route("routes");
}

export function App(props: any) {
	return <div id="app">
		<Button  onclick={route_articles}>Articles</Button>
		<Button  onclick={route_routes}>Routes</Button>
		<hr />	
		<Router history={createHashHistory()}>
			<h1 path="/articles">Artikly</h1>
			<RouteEditor path="/routes/:action?/:id?" />
		</Router>
	</div>;
}
