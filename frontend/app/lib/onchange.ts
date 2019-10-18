import { Component } from "preact";

export function HIValue(component: Component, stateVar: string) {
    return (evt: Event) => {
        let st: any = {};

        st[stateVar] = (evt.target as HTMLInputElement).value;
        component.setState(st);
    };
}