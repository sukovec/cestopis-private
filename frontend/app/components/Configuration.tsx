import { h } from "preact";

import TextField from "preact-material-components/TextField";
import Button from "preact-material-components/Button";


import * as API from "../common/ifaces";
import { HIValue } from "../lib/onchange";
import { IDefProps, IDefState } from "../iface";
import BaseComponent from "./BaseComponent";

interface IConfigurationProps extends IDefProps {}
interface IConfigurationState extends IDefState {
    firstDay: string;
}

export default class Configuration extends BaseComponent<IConfigurationProps, IConfigurationState> {
    constructor(p: IConfigurationProps, ctx: any) {
        super(p, ctx);
        this.updateConfiguration = this.updateConfiguration.bind(this);
    }

    updateConfiguration() {
        let body: API.Configuration = {
            firstDay: this.state.firstDay
        };
        this.download("updating configuration", "/api/misc/config", "PATCH", body)
        .then ( () => {
            this.displayMessage("Config updated", "The configuration was updated successfully");
        });
    }

    componentDidMount() {
        this.download("configuration", "/api/misc/config")
        .then( (res: API.Configuration) => {
            this.setState( {firstDay: res.firstDay});
        });
    }

    r() {
        return <div>
            <TextField type="date" helperText="Date of first day of travel" helperTextPersistent={true} box={true} onChange={HIValue(this, "firstDay")} value={this.state.firstDay} /> <br />
            <Button onClick={this.updateConfiguration}>Update configuration</Button>
        </div>
    }
}