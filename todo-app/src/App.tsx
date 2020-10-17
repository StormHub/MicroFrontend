import * as React from 'react';
import { TodoApp } from './features/todo';

import './App.css';
import { TodoItem } from './features/todo/Model';

const App:React.FC<{ initialItems: TodoItem[]} >  = ({ initialItems }) => {
  return (<TodoApp initialItems={initialItems} />);
}

export default App;
