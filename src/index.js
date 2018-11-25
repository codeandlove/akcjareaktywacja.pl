import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Root } from './client/Root';

import config from './config';

import './index.scss';

import registerServiceWorker from './registerServiceWorker';

import {store, history} from './client/store/store';

if(config.app.enabled) {
    ReactDOM.render(
        <BrowserRouter>
            <Root store={store} history={history} />
        </BrowserRouter>,
        document.getElementById('root')
    );
    
    registerServiceWorker();
};
