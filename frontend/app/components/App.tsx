import { h } from "preact";
import { Router, route } from "preact-router";
import { createHashHistory } from "history";

import Button from 'preact-material-components/Button';
import 'preact-material-components/style.css';

import "../styles/css.css"

import Login from "./Login";
import RouteEditor from "./RouteEditor";
import PhotoTagger from "./PhotoTagger";
import Diary from "./Diary";
import Writers from "./Writers";
import Configuration from "./Configuration";

export function App(props: any) {
	return <div id="app">
		<Button outlined onclick={() => route("/writers")}>Writers</Button>
		<Button outlined onclick={() => route("/diary")}>Diary</Button>
		<Button outlined onclick={() => route("/routes")}>Routes</Button>
		<Button outlined onclick={() => route("/photos")}>Photos</Button>
		<Button outlined onclick={() => route("/config")}>Configuration</Button>
		<hr />	
		<Router history={createHashHistory()}>
			<Login path="/" />
			<RouteEditor path="/routes/:action?/:id?" />
			<PhotoTagger path="/photos/:action?/:id?/:id2?" />
			<Diary path="/diary/:action?" />
			<Writers path="/writers/:writerId?" />
			<Configuration path="/config" />
		</Router>
	</div>;
}
