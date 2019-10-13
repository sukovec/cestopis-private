export interface IDefProps {
	children?: any;
	path?: string;
}

export interface DisplayedError {
	error: string | Error;
	hidden: boolean;
	hideable: boolean;
	repairCb: () => void;
}

export interface RunningDownload {
	display: string;
	opts: RequestInit;
	url: string;
}

export interface DisplayMessage {
	title: string;
	text: string;
	onAccept?: () => void;
	onCancel?: () => void;
	ref?: any;
}

export interface IDefState { // just for BaseComponent-derived components
	__downloads?: Set<RunningDownload>;
	__errors?: Set<DisplayedError>;
	__message?: DisplayMessage;
}