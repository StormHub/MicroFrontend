import { TodoItem } from "./features/todo/Model";
import { IMicroApp } from "./shell/Shell";
import { DomainEvent, EventBus, IDomainEvent, IEventHandler, IEventSubscription, MiddlewareNext } from "./shell/Events"

const middlewareFn = (e: IDomainEvent<{}>, next: MiddlewareNext<{}>) => {
    console.log(new DomainEvent(e.channel, e.payload).toJSON());
    next(e);
}

export const createEventBus = () => {
    const eventBus = new EventBus([middlewareFn]);
    return eventBus;
}

export interface TodoMicroApp extends IMicroApp  {
    // Store current state in the memory, we should
    // not need to do this with real application
    appState: {
        items: TodoItem[]
    },
    eventHandlers: IEventHandler[]
}

export const microApp: TodoMicroApp = {
    appState: { items: [] },
    eventHandlers: [],
};

const getAppEventChannel = () =>  microApp.host || window.location.origin;
  
export const publishEvent = <T>(payload: T) : void => {
    const eventBus = microApp.eventBus;
    if (eventBus) {
        eventBus.publish(new DomainEvent<T>(getAppEventChannel(), payload));
    }
}

interface ISubscription {
    unsubscribe: () => void;
}

export const subscribeEvent = (subscription: IEventSubscription) : ISubscription => {
    const eventBus = microApp.eventBus;
    if (!eventBus) {
        return {
            unsubscribe:  () => {}
        };
    }

    const handler = eventBus.subscribe(subscription);
    const handlers = microApp.eventHandlers;
    microApp.eventHandlers = [ ...handlers, handler ];
    return {
        unsubscribe: () => {
            microApp.eventHandlers = [...microApp.eventHandlers.filter(x => x.index !==  handler.index)]
        }
    };
}
