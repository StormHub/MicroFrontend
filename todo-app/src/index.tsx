import * as React from 'react';
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import App from './App';
import { microApp, MicroAppProps } from './features/shell/Shell';
import { configureEvents, MICRO_APP_MESSAGE } from './features/shell/Events';

const render = (props: MicroAppProps) => {
  const { containerId, history, host } = props;
  const element = document.getElementById(containerId);
  if (!element) {
      throw new Error(`${containerId} does not exist`);
  }

  microApp.host = host;
  microApp.tokenProvider = {
    provider: props.tokenProvider || (() => undefined)
  };

  const browserHistory = history || createBrowserHistory();
  const microAppMessageHandler = configureEvents(window);
  ReactDOM.render(
      <App initialItems={microApp.appState.items} />, 
      element
  );

  microApp.history = browserHistory;
  microApp.eventHandlers.set(MICRO_APP_MESSAGE, microAppMessageHandler);
}

if (typeof microApp.mount === "undefined") {
  microApp.mount = (props: MicroAppProps) => {
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

      microApp.tokenProvider = {
          provider: () => undefined,
          token: undefined
      };
      microApp.host = undefined;
      microApp.eventHandlers.forEach((handler, eventName, _) => {
          window.removeEventListener(eventName, handler);
      });
      microApp.eventHandlers.clear();
      microApp.history = undefined;

      console.info(`unmount micro app`);
  };
}

window.todoMicroApp = microApp;