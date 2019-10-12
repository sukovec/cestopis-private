import { h } from "preact";

import { IDefProps } from "../iface";

import EditPost from "./Diary/EditPost";
import PostList from "./Diary/PostList";

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