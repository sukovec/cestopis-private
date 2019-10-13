import { h } from "preact";
import BC from "./BaseComponent";
import * as X from "../iface";
import * as API from "../common/ifaces";

interface ITCP extends X.IDefProps {

}

interface ITCS extends X.IDefState {
    returned: string;
    returned2: string;
}

export default class TestingComponent extends BC<ITCP, ITCS> {
    componentWillMount() {
        this.download("some bullshit", "/api/testing/n-second-delay/1").then( (res: API.RespID) => {
            this.setState({returned: res});
        });

        this.download("some bullshit", "/api/testing/n-second-delay/3").then( (res: API.RespID) => {
            this.setState({returned: res});
        });

        this.download("some bullshit", "/api/testing/n-second-delay/5").then( (res: API.RespID) => {
            this.setState({returned: res});
        });

        this.download("other bulshit", "/api/testing/random-fail").then( (res: API.RespID) => {
            this.setState({returned2: res});
        });
    }

    r() {
        return <h1>This component is v pořádku: {this.state.returned} and {this.state.returned2}</h1>;
    }
}