import { Component } from "preact";

export function HIValue<TProp, TState, TComp extends Component<TProp,TState>>(component: TComp, stateVar: keyof TState) {
    return (evt: Event) => {
        let st: any = {};

        st[stateVar] = (evt.target as HTMLInputElement).value;
        component.setState(st);
    };
}

export function HIChecked<TProp, TState, TComp extends Component<TProp, TState>>(component: TComp, stateVar: keyof TState) {
    return (evt: Event) => {
        let st: any = {};
        st[stateVar] = (evt.target as HTMLInputElement).checked;
        component.setState(st);
    };
}