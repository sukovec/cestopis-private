import { h } from "preact";

import { IDefProps } from "../iface";

import EditPost from "./Diary/EditPost";
import PostList from "./Diary/PostList";

export interface IConfigurationProps extends IDefProps {
	action?: string;
}

export default function Configuration(props: IConfigurationProps) {
    return <h1>Not implemented</h1>
}