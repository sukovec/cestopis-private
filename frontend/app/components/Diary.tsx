import { h } from "preact";

import Button from 'preact-material-components/Button';
import List from "preact-material-components/List";

import { IDefProps } from "../iface";

import EditPost from "./Diary/EditPost";

export interface DiaryProps extends IDefProps {
	action?: string;
}

export default function Diary(props: DiaryProps) {
    switch(props.action) {
        case "create":
            return <EditPost />;
        case "":
            return <PostList />
        default:
            return <EditPost postId={props.action} />;
    }
}

function PostList() {
    return <h1>PostList <a href="/diary/create">Create new post</a></h1>;
}