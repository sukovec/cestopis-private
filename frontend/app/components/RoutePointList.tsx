import { h, Component } from "preact";

import List from "preact-material-components/List";
import Button from "preact-material-components/Button";

import { IDefProps } from "../iface";
import * as API from "../common/ifaces";

export interface RoutePointListProps extends IDefProps {
    points: API.RoutePoint[];
    onRemoveClick?: (idx: number) => void;
    onInsertClick?: (idx: number) => void;
}

export interface RoutePointListStat {
}

export default class RoutePointList extends Component<RoutePointListProps, RoutePointListStat> {
    renderPoint(rp: API.RoutePoint, idx: number) {
        return <List.Item>
            <List.TextContainer>
                <List.PrimaryText>{Math.round(rp.latlng.lat * 1000000)/1000000}, {Math.round(rp.latlng.lng*1000000)/1000000}</List.PrimaryText>
                <List.SecondaryText>{rp.mode == API.RoutePointMode.ByHand ? "hand" : `routed, ${rp.extRouted.length} subpoints`}</List.SecondaryText>
            </List.TextContainer>
            <List.ItemMeta>
                <Button onClick={() => {this.props.onRemoveClick && this.props.onRemoveClick(idx); }}>Rm</Button>
                <Button onClick={() => {this.props.onInsertClick && this.props.onInsertClick(idx); }}>Ins</Button>
            </List.ItemMeta>
        </List.Item>;
    }
    render() {
        return <List two-line={true}>
            {this.props.points.map(this.renderPoint)}
            </List>
    }
}