import { h } from "preact";

import Button from 'preact-material-components/Button';
import List from "preact-material-components/List";

import { IDefProps } from "../iface";

import EditDay from "./Diary/EditDay";

export interface DiaryProps extends IDefProps {
	day?: string;
}

export default function Diary(props: DiaryProps) {
    let act = props.day || "daylist";
    
    let regdate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

    if (regdate.test(act)) { // then it is a date 
        return <EditDay day={act} />;
    } else if (act == "newday") {
        return <EditDay />
    } else {
        return <DayList />
    }
}

function DayList() {
    return <h1>Day list</h1>
}

