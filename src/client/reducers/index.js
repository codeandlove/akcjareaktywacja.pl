import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { filter } from './filter';
import { client } from './client';

import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    routing: routerReducer,
    filter,
    client
});

export default rootReducer;
