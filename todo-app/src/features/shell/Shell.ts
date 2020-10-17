import { History } from "history";
import { TodoItem } from "../todo/Model";

declare global {
    interface Window {
        todoMicroApp: MicroApp;
    }
}

export const microApp: MicroApp = {
    tokenProvider: {
        token: undefined,
        provider: () => undefined
    },
    eventHandlers: new Map<string, EventListener>(),
    appState: { items: [] }
};

type IBearerToken = string | undefined;

type BearerTokenProvider = {
    (): IBearerToken;
}

export interface MicroAppTokenProvider {
    provider: BearerTokenProvider;
    token?: IBearerToken;
}

export interface MicroAppProps {
    containerId: string;
    host?: string;
    history?: History;
    tokenProvider?: BearerTokenProvider;
}

export interface MicroApp {
    host?: string;
    history?: History;
    mount?: (props: MicroAppProps) => void;
    unmount?: (containerId: string) => void;
    tokenProvider: MicroAppTokenProvider;
    eventHandlers: Map<string, EventListener>;

    // Store current state in the memory, we should
    // not need to do this with real application
    appState: {
        items: TodoItem[]
    }
}
