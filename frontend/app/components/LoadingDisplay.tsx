import { h } from "preact";

import { IDefProps } from "../iface";

export interface ILoadingDisplayProps extends IDefProps {

}

export default function Configuration(props: ILoadingDisplayProps) {
    const { children } = props;
    
    return <div class="loadingdisplay">
            <h1>Loading</h1>
            {children}
        </div>;
}