import * as React from "react";
import { MicroFrontend } from "../shell/MicroFrontend";
import { getTodoAppHost } from "./Host";

const todoHost = getTodoAppHost();

const Todo : React.FC = () => {
    return (
        <div id="todo-container">
            <MicroFrontend
                name="todo"
                host={todoHost}
            />
        </div>
    );
}

export { Todo }
