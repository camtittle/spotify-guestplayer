import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { PostMessage } from './models/PostMesage';
import { NavigateMessage } from './models/NavigateMessage';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();

navigator.serviceWorker.addEventListener('message', event => {
  console.log('got message');
  console.log(event.data);
  const data = event.data as PostMessage<any>;
  if (event.data.type === 'navigate') {
    const path = (data.message as NavigateMessage).path;
    window.location.href = path;
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
