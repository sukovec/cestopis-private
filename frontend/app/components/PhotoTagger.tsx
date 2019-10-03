import { h, render } from "preact";
import { route } from "preact-router";

import Button from 'preact-material-components/Button';
import List from "preact-material-components/List";

import { IDefProps } from "../iface";

import DirList from "./PhotoTagger/DirList";
import PhotoList from "./PhotoTagger/PhotoList";
import Tagger from "./PhotoTagger/Tagger";

export interface PhotoTaggerProps extends IDefProps {
	action?: string;
	id?: string;
	id2?: string;	
}

export default function PhotoTagger(props: PhotoTaggerProps) {
	let act = props.action || "dirlist";

	switch(act) {
		case "dirlist":
			return <DirList />;
		case "dir":
			return <PhotoList dir={props.id} />
		case "tag":
			return <Tagger photo={props.id} />
		case "multi":
			return <MultiTag dir={props.id} tag={props.id2} />
	}
}

function MultiTag(props: any) {
	return <h1>MultiTag dir={props.dir} tag={props.tag}</h1>
}