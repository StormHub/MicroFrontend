export type TodoStatus = "Pending" | "Done";

export interface TodoItem {
    id: string;
    name: string;
    status: TodoStatus;
}
