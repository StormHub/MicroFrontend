import * as React from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { sanitizeHtmlContent } from "../HtmlContent";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing(4)
    },
    editor: {
        marginTop: theme.spacing(1),
        border: "1px dashed #aaa",
        height: theme.spacing(50)
    }
}));



interface IEditButtonProps {
    name?: string;
    cmd: string;
    arg?: string;
}

const EditButton : React.FC<IEditButtonProps> = ({ name, cmd, arg }) => {
    return (
      <IconButton 
        key={cmd}
        onMouseDown={e => {
          e.preventDefault(); // Avoids loosing focus from the editable area
          document.execCommand(cmd, false, arg); // Send the command to the browser
        }}
      >
        {name || cmd}
      </IconButton >
    );
}

const Notes: React.FC = () => {
    const classes = useStyles();
    const [state, setState ] = React.useState(`<p>Hello <b>World</b>!`);

    const handleChange = (e : ContentEditableEvent) => {
        setState(e.target.value);
    };
    
    const sanitize = () => {
        setState(sanitizeHtmlContent(state));
    };
    
    return (
        <div id="notes-app-root" className={classes.root} >
            <div>
                <EditButton cmd="italic" />
                <EditButton cmd="bold" />
                <EditButton cmd="formatBlock" arg="h1" name="heading" />                
            </div>
            <div className={classes.editor}>
                <ContentEditable
                    className="editable"
                    disabled={false}
                    tagName="pre"
                    html={state} // innerHTML of the editable div
                    onChange={handleChange} // handle innerHTML change
                    onBlur={sanitize}
                />                
            </div>
        </div>
    );
}

export { Notes };