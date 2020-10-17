import * as React from "react";
import { TodoItem, TodoStatus } from "./Model";
import { nanoid } from 'nanoid';
import { dispatchMessage } from "../shell/Events";
import { microApp } from "../shell/Shell";

const TODO_RESET = "@TODO/RESET";
type TODO_RESET = typeof TODO_RESET;

const TODO_ADD = "@TODO/ADD";
type TODO_ADD = typeof TODO_ADD;

const TODO_UPDATE = "@TODO/UDPATE";
type TODO_UPDATE = typeof TODO_UPDATE;

const TODO_REMOVE = "@TODO/REMOVE";
type TODO_REMOVE = typeof TODO_REMOVE;

type TodoAction =
  | { type: TODO_RESET; payload: {} }
  | { type: TODO_ADD; payload: { name: string } }
  | { type: TODO_UPDATE; payload: { id: string, status: TodoStatus } }
  | { type: TODO_REMOVE; payload: { id: string } };

interface AppState {
    items: TodoItem[]
}

interface AppContext {
  state: AppState;
  dispatch: React.Dispatch<TodoAction>;
}

const defaultContext: AppContext = {
  state: {
    items: []
  },
  dispatch: _ => { throw new Error("The context has not been initialised.") }
}

interface AppActions {
  reset: (items: TodoItem[]) => void;
  add: (name: string) => void;
  update: (id: string, status: TodoStatus) => void;
  remove: (id: string) => void;
}

const AppContext = React.createContext<AppContext>(defaultContext);

const useActions = ({ dispatch } : AppContext) : AppActions  => ({
  reset: (items: TodoItem[]) => dispatch({type: TODO_RESET, payload: { items }}),
  add: (name: string) => dispatch({ type: TODO_ADD, payload: { name } }),
  update: (id: string, status: TodoStatus) => dispatch({ type: TODO_UPDATE, payload: { id, status }}),
  remove: (id: string) => dispatch({ type: TODO_REMOVE, payload: { id } })
});

const useAppContext = () => {
  const context = React.useContext(AppContext);
  return {
    state: context.state,
    ...useActions(context)
  }
};

const reducer = (state: AppState, action: TodoAction): AppState => {
    switch (action.type) {
        case TODO_RESET:
          return {
            items: []
          };
    
        case TODO_ADD:
          const newTodo : TodoItem = {
            id: nanoid(),
            name: action.payload.name,
            status: "Pending"
          };

          dispatchMessage(action.type, { ...newTodo });
          return {
            items: [ 
              ...state.items, 
              newTodo 
            ]
          };
        
        case TODO_UPDATE: 
          const items = state.items.map(x => {
            if (x.id === action.payload.id) {
              const item = {
                ...x,
                status: action.payload.status
              };
              dispatchMessage(action.type, { ...item });

              return item;
            }
            
            return x;
          });
          
          return {
            items
          };
  
        case TODO_REMOVE:
          const item = state.items.find(x => x.id === action.payload.id);
          if (item) {
            dispatchMessage(action.type, { ...item });
          }

          return {
            items: [ 
              ...state.items.filter(x => x.id !== action.payload.id)
            ]
          };

        default:
          return state;
    }
}

// Store current state in the memory, we should not need to do this with real application
const appReducer = (state: AppState, action: TodoAction): AppState => {
  const newState = reducer(state, action);

  microApp.appState.items = [ ...newState.items ];
  return newState;
}

const AppContextProvider: React.FC<{ initialItems: TodoItem[] }> = ({ children, initialItems }) => {
    const [state, dispatch] = React.useReducer(appReducer, { items: initialItems });
    return (
      <AppContext.Provider value={{ state, dispatch }}>
        {children}
      </AppContext.Provider>);
};

export { useAppContext, AppContextProvider };
