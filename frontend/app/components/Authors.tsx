import { h } from "preact";

import Button from 'preact-material-components/Button';
import List from "preact-material-components/List";

import { IDefProps } from "../iface";

export interface AuthorsProps extends IDefProps {
	authorId?: string;
}

export default function Authors(props: AuthorsProps) {
    if (props.authorId == "new") {
        return <AuthorEdit />;
    } else if (props.authorId !== "") {
        return <AuthorEdit authorId={props.authorId} />
    } else if (props.authorId == "") {
        return <AuthorList />
    } else {
        return <h1>WTF?</h1>;
    }
}

function AuthorList() {
    return <h1>Author list</h1>
}

function AuthorEdit() {
    return <h1>Day list</h1>
}

