import { h, Component } from "preact";

import { IDefProps, IDefState } from "../iface";

interface IDialogProps extends IDefProps {
    visible: boolean;
}
interface IDialogState extends IDefState {}
interface IDialogHeaderProps extends IDefProps {}
interface IDialogHeaderState extends IDefState {}
interface IDialogFooterProps extends IDefProps {}
interface IDialogFooterState extends IDefState {}
interface IDialogBodyProps extends IDefProps {}
interface IDialogBodyState extends IDefState {}

class Dialog extends Component<IDialogProps, IDialogState> {
    public render() {
        if (!this.props.visible) return null;
        return <div class="dialog">
            {this.props.children}
        </div>;
    }
}

class DialogHeader extends Component<IDialogHeaderProps, IDialogHeaderState>{
    public render() {
        return <h1 class="header">{this.props.children}</h1>
    }
}

class DialogFooter extends Component<IDialogFooterProps, IDialogFooterState> {
    public render() {
        return <div class="footer">{this.props.children}</div>;
    }
}

class DialogBody extends Component<IDialogBodyProps, IDialogBodyState> {
    public render() {
        return <div class="body">{this.props.children}</div>;
    }
}

export default class extends Dialog {
    static readonly Header = DialogHeader;
    static readonly Footer = DialogFooter;
    static readonly Body = DialogBody;
}