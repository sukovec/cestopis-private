import { h } from "preact";

// components
import Button from "preact-material-components/Button";
import TextField from "preact-material-components/TextField";

import { IDefProps } from "../iface";


interface ILoginProps extends IDefProps {
    username: string;
    password: string;
    onChangeUsername: (evt: Event) => void;
    onChangePassword: (evt: Event) => void;
    onLoginClick: (evt: Event) => void;
}

export default function Login(props: ILoginProps) {
    const { username, password, onChangePassword, onChangeUsername, onLoginClick } = props;

    return <div>
        <TextField helperText="User name" onChange={onChangeUsername} value={username} /><br />
        <TextField helperText="Password" type="password" onChange={onChangePassword} value={password} /><br />
        <Button onClick={onLoginClick} default={true}>Login</Button>
    </div>
}