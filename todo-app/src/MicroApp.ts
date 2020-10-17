import { TodoItem } from "./features/todo/Model";
import { IMicroApp } from "./shell/Shell";
import { DomainEvent, IEventHandler, IEventSubscription } from "./shell/Events"

const TODO_APP_EVENT_CHANNEL = "todo-micro-app-channel";

export interface TodoMicroApp extends IMicroApp  {
    // Store current state in the memory, we should
    // not need to do this with real application
    appState: {
        items: TodoItem[]
    },
    publishEvent: <T>(payload: T) => void,
    subscribeEvent: (subscription: IEventSubscription) => void,
    eventHandlers: IEventHandler[]
}
  
const publishEvent = <T>(payload: T) : void => {
    console.log(payload);
    microApp.eventBus?.publish(new DomainEvent<T>(TODO_APP_EVENT_CHANNEL, payload));
}

const subscribeEvent = (subscription: IEventSubscription) : void => {
    const handler = microApp.eventBus?.subscribe(subscription);
    if (handler) {
        const handlers = microApp.eventHandlers;
        microApp.eventHandlers = [ ...handlers, handler ];
    }
}

export const microApp: TodoMicroApp = {
    appState: { items: [] },
    publishEvent,
    subscribeEvent,
    eventHandlers: [],
};
