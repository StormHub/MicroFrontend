import { TodoItem } from "../todo/Model";
import { IMicroApp } from "./Shell";

declare global {
    interface Window {
        todoMicroApp: TodoMicroApp;
    }
}

export interface TodoMicroApp extends IMicroApp  {
    // Store current state in the memory, we should
    // not need to do this with real application
    appState: {
        items: TodoItem[]
    }
}

export const microApp: TodoMicroApp = {
    appState: { items: [] }
};
