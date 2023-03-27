import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  FalcorProvider,
  falcorGraph
} from "./modules/avl-falcor"
import { API_HOST } from './config'
import './index.css';

window.global ||= window;

export const falcor = falcorGraph(API_HOST)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FalcorProvider falcor={falcor}>
      <App />
    </FalcorProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

//reportWebVitals();
