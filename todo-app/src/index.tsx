import * as React from 'react';
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import App from './App';
import { IMicroAppProps } from './features/shell/Shell';
import { microApp } from './features/shell/MicroApp';

const render = (props: IMicroAppProps) => {
  const { containerId, history, host } = props;
  const element = document.getElementById(containerId);
  if (!element) {
      throw new Error(`${containerId} does not exist`);
  }

  microApp.host = host;
  microApp.tokenProvider = props.tokenProvider || (() => undefined);

  const browserHistory = history || createBrowserHistory();

  ReactDOM.render(
      <App initialItems={microApp.appState.items} />, 
      element
  );

  microApp.history = browserHistory;
}

if (typeof microApp.mount === "undefined") {
  microApp.mount = (props: IMicroAppProps) => {
      render(props);
      console.info(`mount micro app`);
  };
}

if (typeof microApp.unmount === "undefined") {
  microApp.unmount = (containerId: string) => {
      const element = document.getElementById(containerId);
      if (element) {
          ReactDOM.unmountComponentAtNode(element);
      }

      microApp.tokenProvider = undefined;
      microApp.host = undefined;
      microApp.history = undefined;

      console.info(`unmount micro app`);
  };
}

window.todoMicroApp = microApp;