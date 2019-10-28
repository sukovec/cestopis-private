import { h, render } from "preact";
import { route } from "preact-router";

import Button from 'preact-material-components/Button';
import List from "preact-material-components/List";

import { IDefProps } from "../iface";

import RouteEdit from "./RouteEditor/Edit";
import RouteList from "./RouteEditor/RouteList";

export interface RouteEditorProps extends IDefProps {
	action?: string;
}

export default function RouteEditor(props: RouteEditorProps) {
	let ret;
	if (props.action === "") {
		return <RouteList />
	} else if (props.action === "create") {
		return <RouteEdit />
	} else {
		return <RouteEdit idRoute={props.action} />
	} 
}
