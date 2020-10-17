import * as React from "react";
import { useAppContext } from "./AppContext";
import TextField from '@material-ui/core/TextField';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    text: {
        margin: theme.spacing(1)
    },
}));

const TodoInput : React.FC = () => {
    const classes = useStyles();
    const { add } = useAppContext();
    const [ value, setValue ] = React.useState("");

    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'Enter' && value.length) {
            add(value);
            setValue("");
        }
    }

    const onChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }

    return (
        <TextField 
            autoFocus
            label="What needs to be done ?"
            className={classes.text}
            onChange={onChanged} 
            onKeyPress={onKeyPress} 
            value={value} />
    );
}

export { TodoInput };