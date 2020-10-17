const MICRO_APP_MESSAGE = "micro-app-message";

export interface MicroAppMessage {
    from: string;
    type: string;
    payload: any;
}

const messagingFuction = "__microAppOnMessage";

// Only if the app is running independently, in micro app mode
// this should have already been defined by the 'parent' app
function dispatchMessage(from: string, type: string, detail: any) {
    const customEvent = createCustomEvent(document, from, type, detail);
    window.dispatchEvent(customEvent);
}

if (typeof (window as any)[messagingFuction] == "undefined") {
    (window as any)[messagingFuction] = (from: string, type: string, payload: any) => {
        const customEvent = createCustomEvent(document, from, type, { name, payload });
        window.dispatchEvent(customEvent);
    };
}

function createCustomEvent(doc: Document, from: string, type: string, payload: any): CustomEvent {
    const bubbles = false;
    const cancelable = false;
    const detail = {
        from,
        type,
        payload
    };

    if (typeof CustomEvent !== "function") {
        const event = doc.createEvent("CustomEvent");
        event.initCustomEvent(name, bubbles, cancelable, detail);
        return event;
    }

    return new CustomEvent(MICRO_APP_MESSAGE, { bubbles, cancelable, detail });
}

function configureEvents(window: Window) {
    const microAppMessageHandler = (e: Event) => {
        const message = e as CustomEvent<MicroAppMessage>;
        message.detail
        console.log(message);
    };

    window.addEventListener(MICRO_APP_MESSAGE, microAppMessageHandler);
    return microAppMessageHandler;
}

export { MICRO_APP_MESSAGE, configureEvents, dispatchMessage }
