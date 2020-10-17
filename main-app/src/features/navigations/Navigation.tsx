import * as React from "react";
import Button from '@material-ui/core/Button';

const NAVIGATION_NEXT = "NAVIGATION/NEXT";;
type NAVIGATION_NEXT = typeof NAVIGATION_NEXT;

const NAVIGATION_PREVIOUS = "NAVIGATION/PREVIOUS";
type NAVIGATION_PREVIOUS = typeof NAVIGATION_PREVIOUS;

const NAVIGATION_GOTO = "NAVIGATION/GOTO";
type NAVIGATION_GOTO = typeof NAVIGATION_GOTO;

type NavigationAction =
  | { type: NAVIGATION_NEXT; payload: {} }
  | { type: NAVIGATION_PREVIOUS; payload: {} }
  | { type: NAVIGATION_GOTO; payload: { id: string } };

export interface NavigationItem {
    id: string;
}

interface NavigationState {
    activeId: string,
    items: NavigationItem[]
}

interface NavigationContext {
    state: NavigationState;
    dispatch: React.Dispatch<NavigationAction>;
}

const defaultContext : NavigationContext = {
    state: {
        activeId: "",
        items: []
    },
    dispatch: _ => { throw new Error("The context has not been initialised.") }
};

interface NavigationActions {
    next: () => void;
    previous: () => void;
    goto: (id: string) => void;
}

const NavigationContext= React.createContext<NavigationContext>(defaultContext);

const useNavigation = () => {
    const conext = React.useContext(NavigationContext);
    return { 
        state: conext.state,
        ...useActions(conext)
    }
}

const useActions = ({ dispatch } : NavigationContext) : NavigationActions => ({
    next: () => dispatch({ type: NAVIGATION_NEXT, payload: {} }),
    previous: () => dispatch({ type: NAVIGATION_PREVIOUS, payload: {} }),
    goto: (id: string) => dispatch({ type: NAVIGATION_GOTO, payload: { id } })
});

const reducer = (state: NavigationState, action: NavigationAction): NavigationState => {
    const index = state.items.findIndex(x => x.id === state.activeId);
    switch (action.type) {
        case NAVIGATION_NEXT: 
            const nextItem = index >= 0 
                ?  state.items[(index + 1) % state.items.length] 
                : undefined;
            if (nextItem) {
                return {
                    ...state,
                    activeId: nextItem.id
                 };
            }
            return state;

        case NAVIGATION_PREVIOUS: 
            const previousItem = index >= 0 
                ?  state.items[Math.max(index -1, 0)]
                : undefined;
            if (previousItem) {
                return {
                    ...state,
                    activeId: previousItem.id
                 };
            }
            return state;

        case NAVIGATION_GOTO:
            const item = state.items.find(x => x.id === action.payload.id);
            if (item && item.id !== state.activeId) {
                return {
                    ...state,
                    activeId: item.id
                };
            }
            return state;

         default:
          return state;
    }
}

interface NavigationComposition {
    Button: React.FC<NavigationItem>;
    Panel: React.FC<NavigationItem>;
}
  
const Navigation: React.FC<{ activeId: string; items: NavigationItem[] }> 
    & NavigationComposition = ({ children, activeId, items }) => {
    const [state, dispatch] = React.useReducer(reducer, { activeId, items });

    return (
      <NavigationContext.Provider value={{ state, dispatch }}>
        {children}
      </NavigationContext.Provider>
    );
};

const NavigationButton: React.FC<NavigationItem> = ({ children, id }) => {
    const { state, dispatch } = React.useContext(NavigationContext);
    const item = state.items.find(x => x.id === id);
    if (!item) {
        throw new Error(`${id} does not exist`);
    }

    const onClick = () => {
        dispatch({ type: NAVIGATION_GOTO, payload: { id } });
    }

    return (
      <Button color="primary" key={item.id} onClick={onClick} disabled={state.activeId === id}>
        {children}
      </Button>
    );
};
  
const NavigationPanel: React.FC<NavigationItem> = ({ children, id }) => {
   const { state } = React.useContext(NavigationContext);
   return state.activeId === id ? <div>{children}</div> : null;
};

Navigation.Button = NavigationButton;
Navigation.Panel = NavigationPanel;

export { Navigation, useNavigation };
