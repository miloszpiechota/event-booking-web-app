import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import { store } from "./store/index.js";
import axios from 'axios';
const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL = 'https://inzynierka-event-app-backend.azurewebsites.net/';

root.render(
 
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
 
);


reportWebVitals();
