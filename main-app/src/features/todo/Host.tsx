export const getTodoAppHost = () => {
    return process.env.REACT_APP_TODO_HOST || "http://localhost:3001";
};
