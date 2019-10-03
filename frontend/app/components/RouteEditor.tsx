import { h, render } from "preact";
import { route } from "preact-router";

import Button from 'preact-material-components/Button';
import List from "preact-material-components/List";

import { IDefProps } from "../iface";

import RouteEdit from "./RouteEditor/Edit";

export interface RouteEditorProps extends IDefProps {
	action?: string;
	id?: string;	
}

export default function RouteEditor(props: RouteEditorProps) {
	let ret;
	if (props.action === "" || props.action === "list") {
		return <RouteEditorList />
	} else if (props.action === "create") {
		return <RouteEdit createNew={true} />
	} else if (props.action === "edit" && props.id != "") {
		return <RouteEdit createNew={false} idRoute={props.id} />
	} else {
		return <h1>Route editor - error (action: {props.action}, id: {props.id}</h1>;
	}
}

function RouteEditorList(props: RouteEditorProps) {
	return <List>
			<List.Item><Button onclick={() => {route("routes/create")}}>Create new</Button></List.Item>
		</List>;
}
