import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Root } from './client/Root';

import './index.scss';

import registerServiceWorker from './registerServiceWorker';

import {store, history} from './client/store/store';

ReactDOM.render(
    <BrowserRouter>
        <Root store={store} history={history} />
    </BrowserRouter>,
    document.getElementById('root')
);

registerServiceWorker();
