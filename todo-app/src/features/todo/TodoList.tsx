import * as React from "react";
import { useAppContext } from "./AppContext";
import { TodoItem } from "./Model";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Grid from "@material-ui/core/Grid/Grid";
import { Checkbox } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(1),
        display: "inline-flex"
    },
    card: {
        margin: theme.spacing(1)
    },
    delete: {
        marginLeft: "auto"
    }
}));

const TodoListItem : React.FC<{ item: TodoItem }> = ({ item }) => {
    const classes = useStyles();
    const { update, remove } = useAppContext();

    const [ showRemove, setShowRemove ] = React.useState(false);

    const onMouseEnter = (_: React.MouseEvent<HTMLDivElement>) => {
        setShowRemove(true);
    } 

    const onMouseLeave = (_: React.MouseEvent<HTMLDivElement>) =>{
        setShowRemove(false);
    } 

    const onRemoveTodo = (_: React.MouseEvent<HTMLButtonElement>) =>{
        remove(item.id);
    } 

    const onStatusChanged = (_: React.FormEvent<HTMLInputElement>, checked: boolean) => {
        update(item.id, checked ? "Done" : "Pending");
    }

    const done = item.status === "Done";
    const content = item.name;

    return (
        <Card elevation={3} key={item.id} className={classes.card} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {content}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Checkbox size="small" color="primary" onChange={onStatusChanged} checked={done}/>
                { showRemove &&
                    (<IconButton size="small" aria-label="delete" onClick={onRemoveTodo} className={classes.delete}>
                        <DeleteIcon color="secondary" />
                    </IconButton>
                )}
            </CardActions>
        </Card>
    );
};

const TodoList : React.FC = () => {
    const classes = useStyles();
    const { state } = useAppContext();

    return (
        <div id="todo-list-root" className={classes.root}>
            <Grid container spacing={2}>
                {state.items.map(x => { 
                    return (
                        <Grid key={x.id} item xs={6} sm={3}>
                            <TodoListItem item={x} />
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
};

export { TodoList };