// SIGNAL: Tell the browser to hide the loading spinner IMMEDIATELY
// This MUST be at the very top so the spinner disappears even if React takes time to mount
document.body.classList.add('app-ready');

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
