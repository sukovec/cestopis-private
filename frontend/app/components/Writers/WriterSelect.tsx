import { h } from "preact";
import FormField from "preact-material-components/FormField";
import Radio from "preact-material-components/Radio";

import { IDefProps } from "../../iface";
import * as API from "../../common/ifaces";

interface IWriterSelectProps extends IDefProps {
    onChange: JSX.EventHandler<Event>;
    writers: API.Writer[];
    selected: string;
}

export default function WriterSelect(props: IWriterSelectProps) {
    const { onChange, writers, selected } = props;
    return <fieldset onChange={onChange}>
        {writers.map(itm => <FormField><Radio name="writerselect" value={itm._id} checked={itm._id == selected} />{itm.fullName}</FormField>)}
    </fieldset>;
}