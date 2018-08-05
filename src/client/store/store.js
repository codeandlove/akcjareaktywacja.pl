import firebase from "./../../firebase";

import { createStore, compose, applyMiddleware } from "redux";
import { reactReduxFirebase } from "react-redux-firebase";

import moment from "moment";

import { routerMiddleware } from "react-router-redux"

import createHistory from "history/createBrowserHistory";

// import the root reducer
import rootReducer from "./../reducers";

// react-redux-firebase options
const config = {
    userProfile: "users", // saves user profiles to "/users" on Firebase
    chat: "chat",
    events: "events",
    preserveOnLogout: ["events", "chat", "users"],
    enableLogging: false, // enable/disable Firebase"s database logging
};

// Create a history of your choosing (we"re using a browser history in this case)
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// Add redux Firebase to compose
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, config),
    applyMiddleware(middleware)
)(createStore);

//Local storage settings
const localStorageSettings = JSON.parse(localStorage.getItem("data"));

const initialState = {
    filter: {
        viewType: !!localStorageSettings ? localStorageSettings.viewType : "weeksView",
        date_from: !!localStorageSettings ? moment(localStorageSettings.date_from) : moment(),
        date_to: !!localStorageSettings ? moment(localStorageSettings.date_to) : moment().add(7, "days"),
        chat_mode: 'regular'
    },
    client: {
        ip: null
    }
};

// Create store with reducers and initial state
export const store = createStoreWithFirebase(rootReducer, initialState);
