import { h } from "preact";

import Button from 'preact-material-components/Button';
import List from "preact-material-components/List";

import { IDefProps } from "../iface";

export interface WritersProps extends IDefProps {
	writerId?: string;
}

export default function Writers(props: WritersProps) {
    if (props.writerId == "new") {
        return <WriterEdit />;
    } else if (props.writerId !== "") {
        return <WriterEdit authorId={props.writerId} />
    } else if (props.writerId == "") {
        return <WritersList />
    } else {
        return <h1>WTF?</h1>;
    }
}

function WritersList() {
    return <h1>Writers list</h1>
}

function WriterEdit() {
    return <h1>Day list</h1>
}

