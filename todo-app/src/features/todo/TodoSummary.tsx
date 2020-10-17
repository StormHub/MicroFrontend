import * as React from "react";
import { useAppContext } from "./AppContext";
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      display: "flex",
      marginTop: theme.spacing(2)
    },
    summary: {
      display: "flex",
      flexDirection: "column"
    },
    paper: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
    type: {
        fontSize: theme.spacing(1.5)
    }
 }));

type SummaryType = "Active" | "Completed";

const Summary : React.FC<{ value: number; type: SummaryType; }> = ({ value, type }) => {
    const classes = useStyles();

    return (
        <div id="todo-summary-root" className={classes.summary}>
            <Paper elevation={0} className={classes.paper}>
                <Typography variant="h3" color={type === "Completed" ? "primary" : "textSecondary"} align="center">
                    {value}
                </Typography>
            </Paper>
            <Paper elevation={0}>
                <Typography className={classes.type} color={type === "Completed" ? "primary" : "textSecondary"} align="center">
                    {type}
                </Typography>
            </Paper>
        </div>
    );
}

const TodoSummary : React.FC = () => {
    const classes = useStyles();
    const { state } = useAppContext();
    const pendingItems = state.items.filter(x => x.status === "Pending");
    const doneItems = state.items.filter(x => x.status === "Done");

    return (
        <div id="todo-summary-list" className={classes.root}>
            <Summary value={pendingItems.length} type="Active" />
            <Summary value={doneItems.length} type="Completed" />
        </div>
    );
}

export { TodoSummary };