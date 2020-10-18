import * as React from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Navigation } from "./navigations/Navigation";
import { Notes } from "./notes/Notes";
import { Todo } from "./todo/Todo";
import { shell } from "./shell/Shell";
import { getTodoAppHost } from "./todo/Host";

const MAIN_NOTES_ID = "main-notes";
const TODO_APP_ID = "todo-app";

const navigationItems = [
    { id: MAIN_NOTES_ID },
    { id: TODO_APP_ID }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(4)
  }
}));

const Home : React.FC = () => {
  const classes = useStyles();
  
  React.useEffect(() => {
    const handler = shell.eventBus.subscribe({
      channel: getTodoAppHost(),
      callback: payload => console.log(">> main app", payload)
    });

    return () => handler.unsubscribe();
  }, []);

  return (
    <div className={classes.root}>
      <Navigation activeId={MAIN_NOTES_ID} items={navigationItems}>

        <div>
            <Navigation.Button id={MAIN_NOTES_ID}>
                Notes
            </Navigation.Button>
            <Navigation.Button id={TODO_APP_ID}>
                Todo
            </Navigation.Button>
        </div>

        <div>
            <Navigation.Panel id={MAIN_NOTES_ID}>
                <Notes />
            </Navigation.Panel>
            <Navigation.Panel id={TODO_APP_ID}>
                <Todo />
            </Navigation.Panel>
        </div>

      </Navigation>
    </div>
  );
}

export { Home };