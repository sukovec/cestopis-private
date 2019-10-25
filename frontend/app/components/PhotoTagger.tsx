import { h } from "preact";
import { IDefProps } from "../iface";

import DirList from "./PhotoTagger/DirList";
import PhotoList from "./PhotoTagger/PhotoList";
import Tagger from "./PhotoTagger/Tagger";
import MultiTag from "./PhotoTagger/MultiTag";

export interface PhotoTaggerProps extends IDefProps {
	action?: string;
	id?: string;
	id2?: string;
	id3?: string;
}

export default function PhotoTagger(props: PhotoTaggerProps) {
	let act = props.action || "dirlist";

	switch(act) {
		case "dirlist":
			return <DirList />;
		case "dir":
			return <PhotoList dir={props.id} />
		case "tag":
			return <Tagger photoId={props.id} />
		case "multi":
			return <MultiTag dir={props.id} tag={props.id2} subtag={props.id3} />
	}
}
