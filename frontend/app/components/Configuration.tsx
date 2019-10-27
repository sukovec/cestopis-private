import { h } from "preact";

// components
import TextField from "preact-material-components/TextField";
import Button from "preact-material-components/Button";

// local components
import BaseComponent from "./BaseComponent";
import WriterSelect from "./Writers/WriterSelect";

import * as API from "../api/main";
import { HIValue } from "../lib/onchange";
import { IDefProps, IDefState } from "../iface";


interface IConfigurationProps extends IDefProps {}
interface IConfigurationState extends IDefState {
    firstDay: string;
    usrAssocWriterId: string;
    writerList: API.Writer[];
}

export default class Configuration extends BaseComponent<IConfigurationProps, IConfigurationState> {
    constructor(p: IConfigurationProps, ctx: any) {
        super(p, ctx);
        this.updateConfiguration = this.updateConfiguration.bind(this);
        this.updateUserConfiguration = this.updateUserConfiguration.bind(this);
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

    updateUserConfiguration() {
        // TODO
        // and also, store and display all of user configuration
    }

    componentDidMount() {
        this.download("configuration", "/api/misc/config")
        .then( (res: API.Configuration) => {
            this.setState( {firstDay: res.firstDay});
        });

        this.download("user configuration", "/api/user/config")
        .then( (res: API.UserConfig) => {
            this.setState( {usrAssocWriterId: res.assocWriterId});
        });

        this.download("writer list", "/api/writers")
        .then( (res: API.Writer[]) => {
            this.setState( {writerList: res} );
        });

        
    }

    r() {
        if (!this.state.writerList) return <h1>Not loaded</h1>;
        return <div>
            <h1>Global configuration</h1>
            <TextField type="date" helperText="Date of first day of travel" helperTextPersistent={true} box={true} onChange={HIValue(this, "firstDay")} value={this.state.firstDay} /> <br />
            <Button onClick={this.updateConfiguration}>Update global configuration</Button>
            <hr />
            <h1>User configuration</h1>
            <WriterSelect 
                onChange={HIValue(this, "usrAssocWriterId")} 
                writers={this.state.writerList}
                selected={this.state.usrAssocWriterId} /> 

            <Button onClick={this.updateUserConfiguration}>Update user configuration</Button>

        </div>
    }
}