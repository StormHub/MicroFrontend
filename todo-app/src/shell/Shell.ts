import { History } from "history";
import { IEventBus } from "./Events";

export type IBearerToken = string;

export interface ITokenProvider {
    provider: () => IBearerToken;
}

export interface IMicroAppProps {
    containerId: string;
    host?: string;
    history?: History;
    tokenProvider?: ITokenProvider;
    eventBus?: IEventBus;
}

export interface IMicroApp<Props extends IMicroAppProps = IMicroAppProps> {
    host?: string;
    history?: History;
    mount?: (props: Props) => void;
    unmount?: (containerId: string) => void;
    tokenProvider?: ITokenProvider;
    eventBus?: IEventBus;
}
