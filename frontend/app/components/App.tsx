import { h, render } from "preact";
import { Router, route } from "preact-router";
import { createHashHistory } from "history";

import Button from 'preact-material-components/Button';
import TopAppBar from 'preact-material-components/TopAppBar';
import 'preact-material-components/style.css';


import RouteEditor from "./RouteEditor";
import PhotoTagger from "./PhotoTagger";

export function App(props: any) {
	return <div id="app">
		<Button outlined onclick={() => route("articles")}>Articles</Button>
		<Button outlined onclick={() => route("routes")}>Routes</Button>
		<Button outlined onclick={() => route("photos")}>Photos</Button>
		<hr />	
		<Router history={createHashHistory()}>
			<h1 path="/articles">Artikly</h1>
			<RouteEditor path="/routes/:action?/:id?" />
			<PhotoTagger path="/photos/:directory?/:photo?" />
		</Router>
	</div>;
}
