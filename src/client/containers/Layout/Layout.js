import React from "react";

import { Redirect } from "react-router";
import { Route, Switch } from "react-router-dom"

import EventsList from "../EventsList/EventsList";
import Chat from "./../Chat/Chat";
import EventForm from "./../EventForm/EventForm";
import Login from "./../Login/Login";
import Register from "./../Register/Register";
import Reset from "./../Reset/Reset";
import User from "./../User/User";
import EventPage from "./../EventPage/EventPage";
import Filter from "./../Filters/Filters";

import "./Layout.scss";

const Layout = (props) => {

    const isAuthorized = (component, route) =>{

        const { auth } = props;

        if(!auth) {
            return null;
        }

        if(auth.isLoaded && !auth.isEmpty && !auth.isAnonymous) {
            return component;
        } else {

            return <Redirect to={route} />

        }
    };

    const cssClass = () => {

        const { isColOpen, isColExpanded, isPageOpen } = props;

        const colClass = (isColOpen) ? "col-open": "";

        const colExpandClass = (isColExpanded) ? "col-expand": "";

        const pageClass = (isPageOpen) ? "page-open": "";

        return `${colClass} ${colExpandClass} ${pageClass}`;
    };

    const colRoutes = () => {

        const eventList = <EventsList events={props.events} close={props.colClose} viewEvent={key => props.viewEvent(key)} toggleFilters={props.toggleFilters} />;

        return (
            <Switch>
                <Route exact path="/" render={() => eventList } />
                <Route exact path="/eventForm" render={() => <EventForm coordinates={(!!props.event) ? props.event.coordinates : null} cancel={props.formCancel} toggleColExpand={props.toggleColExpand} saveEvent={val => props.saveEvent(val)} updateEvent={val => props.updateEvent(val)} /> } />
                <Route path="/eventForm/:eventDate" render={({match}) => <EventForm {...match} coordinates={(!!props.event) ? props.event.coordinates : null} cancel={props.formCancel} toggleColExpand={props.toggleColExpand} saveEvent={val => props.saveEvent(val)} updateEvent={val => props.updateEvent(val)} /> } />
                <Route path="/list" render={() => eventList } />
                <Route path="/chat" render={() => <Chat data={props.chat} close={props.colClose} />} />
                <Route path="/login" render={() => <Login close={props.colClose} /> } />
                <Route path="/register" render={() => <Register close={props.colClose} /> } />
                <Route path="/reset" render={() => <Reset close={props.colClose} /> } />
                <Route path="/user" render={() => isAuthorized(<User close={props.colClose} />, "/")} />
                <Route path="/*" render={() => eventList } />
            </Switch>
        )
    };

    const pageRoutes = () => {

        const { pageClose, pageOpen } = props;

        return (
            <Switch>
                <Route exact path="/" render={() => null } />
                <Route exact path={`/event/preview`} render={(props) => <EventPage {...props} isDraft={true} close={pageClose} open={pageOpen} /> } />
                <Route path={`/event/:slug`} render={(props) => <EventPage {...props} close={pageClose} open={pageOpen} /> } />
            </Switch>
        )
    };

    const additionalRoutes = () => {
        return (
            <Switch>
                <Route exact path="/filter" render={(props) => <Filter {...props} />} />
            </Switch>
        )
    };

    return (
        <main className={cssClass()} >
            <div className="col-wrapper">
                {colRoutes()}
            </div>
            <div className="map-wrapper">
                {props.children}
            </div>
            <div className="page-wrapper">
                {pageRoutes()}
            </div>
            {additionalRoutes()}
        </main>
    );
};

export default Layout;