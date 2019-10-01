import { h, render } from "preact";
import { route } from "preact-router";

import Button from 'preact-material-components/Button';
import List from "preact-material-components/List";

import { IDefProps } from "../iface";

import DirList from "./PhotoTaggerDirlist";

export interface PhotoTaggerProps extends IDefProps {
	directory?: string;
	photo?: string;	
}

export default function PhotoTagger(props: PhotoTaggerProps) {
    if (props.directory === "") {
        return <DirList />
    } else if (props.directory !== "" && props.photo === "") {
        return <h1>Direktory set, foto nic</h1>
    } else {
        return <h1>Foto edit</h1>
    }

	/*let ret;
	if (props.action === "" || props.action === "list") {
		return <RouteEditorList />
	} else if (props.action === "create") {
		return <RouteEditorEdit createNew={true} />
	} else if (props.action === "edit" && props.id != "") {
		return <RouteEditorEdit createNew={false} idRoute={props.id} />
	} else {
		return <h1>Route editor - error (action: {props.action}, id: {props.id}</h1>;
	}*/
}
