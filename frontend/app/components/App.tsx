import { h } from "preact";
import { Router, route } from "preact-router";
import { createHashHistory } from "history";

import "../styles/css.css"
import 'preact-material-components/style.css';

import * as X from "../iface";
import * as API from "../api/main";
import { HIValue } from "../lib/onchange";

import BaseComponent from "./BaseComponent";

import Button from 'preact-material-components/Button';
import Login from "./Login";
import Dialog from "./Dialog";

// routed-components

import RouteEditor from "./RouteEditor";
import PhotoTagger from "./PhotoTagger";
import Diary from "./Diary";
import Writers from "./Writers";
import Configuration from "./Configuration";
import TagEdit from "./TagEdit";

interface IAppProps extends X.IDefProps {

}

interface IAppState extends X.IDefState {
	username: string;
	password: string;
	challenge: string;
	logged: boolean;
}

export default class App extends BaseComponent<IAppProps, IAppState> {
	constructor(p: IAppProps, ctx: any) {
		super(p, ctx);
		this.state = {
			username: "", password: "", challenge: "", logged: false
		};

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	componentDidMount() {
		this.download("login status", API.Urls.Users.p("status"))
			.then((res: API.RespLoginStatus) => {
				this.setState({ logged: res.logged, username: res.user });
			});
	}

	logout() {
		this.download("logout", API.Urls.Users.p("logout"), "POST")
			.then((res: API.RespLoginStatus) => {
				this.setState({ logged: res.logged, username: res.user });
			});
	}

	async login() {
		let usr = this.state.username;
		let pwd = this.state.password;
		/**/

		let txe = new TextEncoder();

		// download challenge
		let challenge: API.RespChallenge = await this.download("challenge", API.Urls.Users.p("challenge"))

		// digest user-entered password
		let pwbin = txe.encode(pwd); // utf8 -> bin
		let dgst = await crypto.subtle.digest("SHA-256", pwbin); // sha256(pwd)

		// make it hex, join with challenge and binarize 
		let pwhashhex = Array.from(new Uint8Array(dgst)).map(b => b.toString(16).padStart(2, '0')).join('');
		pwbin = txe.encode(challenge + pwhashhex); // utf8->bin(challenge+sha256(pwd))
		dgst = await crypto.subtle.digest("SHA-256", pwbin); // sha256(challenge+sha256(pwd))
		let finalhash = Array.from(new Uint8Array(dgst)).map(b => b.toString(16).padStart(2, '0')).join('');
		let body: API.LoginRequest = {
			user: usr,
			passwd: finalhash
		};

		let logstat: API.RespLoginStatus = await this.download("login", API.Urls.Users.p("login"), "POST", body);

		this.setState({ logged: logstat.logged, username: logstat.user, password: null });
		if (!logstat.logged) {
			//this.displayMessage("Login error", "Login have failed")
		}
	}

	renderApp() {
		return <div id="app">
			<Button outlined onclick={() => route("/writers")}>Writers</Button>
			<Button outlined onclick={() => route("/diary")}>Diary</Button>
			<Button outlined onclick={() => route("/routes")}>Routes</Button>
			<Button outlined onclick={() => route("/photos")}>Photos</Button>
			<Button outlined onclick={() => route("/tags")}>Tags</Button>
			<Button outlined onclick={() => route("/config")}>Configuration</Button>
			
			<Button secondary onclick={this.logout}>Log out</Button>

			<hr />
			<Router history={createHashHistory()}>
				<RouteEditor path="/routes/:action?" />
				<PhotoTagger path="/photos/:action?/:id?/:id2?/:id3?" />
				<Diary path="/diary/:action?" />
				<Writers path="/writers/:writerId?" />
				<Configuration path="/config" />
				<Greeting path="/" username={this.state.username} />
				<TagEdit path="/tags/:tagId?" />
			</Router>
		</div>;
	}

	renderLogin() {
		const { username, password } = this.state;
		return <Dialog visible={true}>
			<Dialog.Header>Login</Dialog.Header>
			<Dialog.Body>
				<Login
					username={username}
					password={password}
					onChangePassword={HIValue(this, "password")}
					onChangeUsername={HIValue(this, "username")}
					onLoginClick={this.login} />
			</Dialog.Body>
		</Dialog>
	}

	r() {
		const { logged } = this.state;
		if (logged)
			return this.renderApp();
		else
			return this.renderLogin();
	}
}

function Greeting(props: {username: string, path?: string}) {
	return <h1>Hello, {props.username}</h1>;
}