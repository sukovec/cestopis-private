import { h } from "preact";

import { IDefProps } from "../iface";

export interface IErrorDisplayProps extends IDefProps {
    source: string;
    error?: any;
    title?: string;
}

export default function Configuration(props: IErrorDisplayProps) {
    const { source, error, children, title } = props;
    let detail = null;

    if (error) { // TODO: if it's Error, display everything, like stacktrace
        detail = <p>Detail: {error}</p>;
    }

    return <div class="errordisplay">
            <h1>{title ? title : "Error"}</h1>
            <p>An error occurred in {source}:</p>
            <p>{children}</p>
            {detail}
        </div>;
}