import { createBrowserHistory, History } from "history";
import { EventBus, IEventBus } from "./Events";

type IBearerToken = string;

interface ITokenProvider {
    provider: () => IBearerToken;
}

const dummyTokenProvider = () => "Main app bearer token provider";

export const createEventBus = () => {
    const eventBus = new EventBus();
    return eventBus;
}

export interface IShell {
    history: History;
    window: Window;
    document: Document;
    tokenProvider: ITokenProvider;
    eventBus: IEventBus
}

export const shell: IShell = {
    history: createBrowserHistory(),
    window,
    document,
    tokenProvider: {
        provider: dummyTokenProvider
    },
    eventBus: createEventBus()
};

export interface MicroAppProps {
    containerId: string;
    host: string;
    history: History;
    tokenProvider: ITokenProvider;
    eventBus: IEventBus;
}

export interface MicroApp {
    mount?: (props: MicroAppProps) => void;
    unmount?: (containerId: string) => void;
}

export const getContainerId = (name: string) => `${name}-container`;

export const mountMicroApp = (
    name: string,
    host: string
) => {
    const microApp = (window as any)[`${name}MicroApp`] as MicroApp;
    if (typeof microApp === "undefined" || !microApp.mount) {
        console.warn(`micro app ${name} undefined`);
        return;
    }

    const containerId = getContainerId(name);
    microApp.mount({
        containerId,
        host,
        history: shell.history,
        tokenProvider: shell.tokenProvider,
        eventBus: shell.eventBus
    });
};

export const unmountMicroApp = (name: string) => {
    const microApp = (window as any)[`${name}MicroApp`] as MicroApp;
    if (typeof microApp !== "undefined" && microApp.unmount) {
        const containerId = getContainerId(name);
        microApp.unmount(containerId);
    }
};
