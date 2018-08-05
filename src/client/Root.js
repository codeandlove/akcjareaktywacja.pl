import React from 'react';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import App from './containers/App/App';

export const Root = (props) => {

    // Create an enhanced history that syncs navigation events with the store
    const {history, store } = props;

    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App history={history} />
            </ConnectedRouter>
        </Provider>
    )
};
