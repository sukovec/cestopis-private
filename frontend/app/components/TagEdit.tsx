import { h } from "preact";
import { IDefProps } from "../iface";

import TagList from "./TagEdit/TagList";
import TagEditor from "./TagEdit/TagEditor";

export interface TagEditProps extends IDefProps {
    tagId?: string;
}

export default function TagEdit(props: TagEditProps) {
	let tagId = props.tagId;

	switch(tagId) {
		case "":
			return <TagList />
        case "create":
            return <TagEditor tagId="" />;
        default:
            return <TagEditor tagId={tagId} />;
	}
}
