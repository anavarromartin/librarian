import React from 'react';
import ReactDOM from 'react-dom';
import './index.css.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

fetch(`${process.env.REACT_APP_API_URL || window.location.origin}/api/offices`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
}).then(offices => {
   return offices.json()
}).then(offices => {
    ReactDOM.render(<App offices={offices.data.offices}/>,
        document.getElementById('root'));
})


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
