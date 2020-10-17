import * as React from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AppContextProvider } from "./AppContext";
import { TodoList } from "./TodoList";
import { TodoInput } from "./TodoInput";
import { TodoSummary } from "./TodoSummary";
import { TodoItem } from "./Model";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      marginTop: theme.spacing(4)
    },
}));

const TodoApp : React.FC<{ initialItems: TodoItem[]} > = ({ initialItems }) => {
    const classes = useStyles();

    return (
        <div id="todo-app-root" className={classes.root} >
            <AppContextProvider initialItems={initialItems}>
                <TodoInput />
                <TodoList />
                <TodoSummary />
            </AppContextProvider>
        </div>
    );
};

export { TodoApp };