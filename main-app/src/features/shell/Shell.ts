import { createBrowserHistory, History } from "history";

export type IBearerToken = string | undefined;

let BearerToken: IBearerToken;

export const getBearerToken = (): IBearerToken => {
    return BearerToken;
};

export const setBearerToken = (token: IBearerToken) => {
    BearerToken = token;
};

type BearerTokenProvider = {
    (): IBearerToken;
}

export interface IShell {
    history: History;
    window: Window;
    document: Document;
    tokenProvider: () => IBearerToken;
}

export const Shell: IShell = {
    history: createBrowserHistory(),
    window,
    document,
    tokenProvider: getBearerToken
};

export interface MicroAppProps {
    containerId: string;
    host: string;
    history: History;
    tokenProvider: BearerTokenProvider;
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
        history: Shell.history,
        tokenProvider: Shell.tokenProvider
    });
};

export const unmountMicroApp = (name: string) => {
    const microApp = (window as any)[`${name}MicroApp`] as MicroApp;
    if (typeof microApp !== "undefined" && microApp.unmount) {
        const containerId = getContainerId(name);
        microApp.unmount(containerId);
    }
};
