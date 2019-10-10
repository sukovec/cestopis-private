import { h } from "preact";
import { IDefProps } from "../iface";

import WritersList from "./Writers/WritersList";
import WriterEdit from "./Writers/WriterEdit";

export interface WritersProps extends IDefProps {
	writerId?: string;
}

export default function Writers(props: WritersProps) {
    if (props.writerId == "new") {
        return <WriterEdit />;
    } else if (props.writerId !== "") {
        return <WriterEdit writerId={props.writerId} />
    } else if (props.writerId == "") {
        return <WritersList />
    } else {
        return <h1>WTF?</h1>;
    }
}
