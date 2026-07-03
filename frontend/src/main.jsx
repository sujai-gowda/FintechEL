import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register the service worker for offline support and installability
// autoUpdate: true — silently refreshes cached assets when a new version is deployed
registerSW({
  onNeedRefresh() {
    // New content available — auto-update without prompting
  },
  onOfflineReady() {
    console.info('MCA App: ready to work offline');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

