import { h, render } from "preact";

import Button from 'preact-material-components/Button';

import { IDefProps } from "../iface";

import RouteEditorEdit from "./RouteEditorEdit";

export interface RouteEditorProps extends IDefProps {
	action?: string;
	id?: string;	
}

export default function RouteEditor(props: RouteEditorProps) {
	return <RouteEditorEdit createNew={true} />;

	if (props.action === "" || props.action === "list") {
		return <RouteEditorList />
	} else if (props.action === "create") {
		return <RouteEditorEdit createNew={true} />
	} else if (props.action === "edit" && props.id != "") {
		return <RouteEditorEdit createNew={false} idRoute={props.id} />
	} else {
		return <h1>Route editor - error (action: {props.action}, id: {props.id}</h1>;
	}
}

function RouteEditorList(props: RouteEditorProps) {
	return <h1>List of routes</h1>
}
