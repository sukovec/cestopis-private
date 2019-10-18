import { h } from "preact";

import TextField from "preact-material-components/TextField";

import { IDefProps, IDefState } from "../iface";
import BaseComponent from "./BaseComponent";

interface IConfigurationProps extends IDefProps {}
interface IConfigurationState extends IDefState {}

export default class Configuration extends BaseComponent<IConfigurationPops, IConfigurationState> {
    constructor(p: IConfigurationProps, ctx: any) {
        super(p, ctx);
    }

    r() {
    return <TextField type="date" helperText="Date of day" helperTextPersistent={true} box={true} onChange={HIValue(this, "postDate")} value={postDate} />;
    }
}