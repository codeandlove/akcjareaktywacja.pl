import React, { Component } from "react";
import { PropTypes } from "prop-types";

import { Link } from "react-router-dom";

import JoinEvent from "./../Join/Join";

import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import { bindActionCreators } from "redux";
import * as actionCreators from "./../../actions/filter";

import moment from "moment";

import "./EventsList.scss";

import { Container, Header, Segment, Item, Button, Transition, Dimmer, Loader } from "semantic-ui-react";

class EventsList extends Component {

    listView = data => {

        const {filter: {date_from, date_to}} = this.props;

        const duration = moment(date_to).diff(moment(date_from), "days");

        if(data.length < 1) {
            return (
                <Segment>
                    <h3>Wydarzenia od <u>{moment(date_from).format("DD MMMM YYYY")}</u> do <u>{moment(date_to).format("DD MMMM YYYY")}</u> ({duration}dni)</h3>
                    <p>Brak wydarzeń w wybranym zakresie dat. Zmień zakres dat w zakładce <Link to="/filter">Filtry</Link></p>
                </Segment>
            )
        }

        return (
            <Transition.Group
                key="events-list"
                as={Item.Group}
                duration={300}
                animation="fade up"
                relaxed
            >
                {
                    data.map((data, key) => {
                        return (
                            <Item key={`List-item-${key}`}>
                                <Item.Content>
                                    <Segment textAlign="left">

                                        <Item.Header as="h3">
                                            <Link to={`/event/${data.slug}`} >
                                                {data.title}
                                            </Link>
                                        </Item.Header>
                                        <Item.Meta>
                                            <small>Data wydarzenia: <strong>{moment(data.date).format("DD MMMM YYYY, h:mm:ss")}</strong></small><br />
                                            <small>Organizator: <strong>{data.owner}</strong></small>
                                        </Item.Meta>
                                        <Item.Description>
                                            {data.short}
                                        </Item.Description>
                                        <Item.Extra>
                                            <JoinEvent eventKey={data.key} event={data} floated="right" />
                                        </Item.Extra>

                                    </Segment>
                                </Item.Content>
                            </Item>
                        )
                    })
                }
            </Transition.Group>
        )
    };

    weeksView = data => {

        const { filter: {date_from, date_to} } = this.props;

        const days = [moment(date_from)];

        const duration = date_to.diff(date_from, "days");

        if(duration < 0) {
            return (
                <p>Brak wyników spełaniących kryteria</p>
            )
        }

        for(let i = 0; i < duration; i++) {
            days.push(moment(date_from).add(i+1, "days"));
        }

        return (
            <Transition.Group
                key="events-list"
                as={Item.Group}
                duration={300}
                animation="fade up"
                divided
            >
                {
                    days.map((day, key) => {

                        const dayEvents = data.filter((event) => {
                            return moment(day).isSame(moment(event.date), "day");
                        });

                        //moment(day).isSame(moment().subtract(1, "days"), "day") ||
                        const isInPast = (moment(day).diff(moment(), "days") < 0);

                        return (
                            <Item key={`List-item-${key}`}>
                                <Item.Content>
                                    <Item.Header as={Header} color={isInPast ? "grey" : "olive"}>
                                        {moment(day).format("dddd, DD MMMM YYYY")}
                                    </Item.Header>

                                        {
                                            (isInPast && dayEvents.length <= 0) ? (
                                                <p><small>Tego dnia nie odbyło się żadne wydarzenie...</small></p>
                                            ) : null
                                        }

                                        {
                                            (!isInPast && dayEvents.length <= 0) ? (
                                                <p><small>W tym dniu nie ma żadnych wydarzeń jeszcze...</small></p>
                                            ) : null
                                        }

                                        {
                                            !isInPast ?
                                                <p><Link to={`/eventForm/${day}`}>Dodaj własne wydarzenie</Link></p>
                                            : null
                                        }

                                        {
                                            dayEvents.length > 0 ? (
                                                <Segment.Group>
                                                    {
                                                        dayEvents.map((event, key) => {

                                                                return (
                                                                    <Transition.Group
                                                                        key={`List-item-events-${key}`}
                                                                        as={Segment}
                                                                        duration={300}
                                                                        animation="fade up"
                                                                        textAlign="left"
                                                                        secondary={isInPast}
                                                                    >
                                                                        <Header as="h4" >
                                                                            <Link to={`/event/${event.slug}`}>
                                                                                {event.title}
                                                                            </Link>
                                                                        </Header>
                                                                        <Item.Meta>
                                                                            <small>Data wydarzenia: <strong>{moment(event.date).format("DD MMMM YYYY, h:mm:ss")}</strong></small><br />
                                                                            <small>Organizator: <strong>{event.owner}</strong></small>
                                                                        </Item.Meta>
                                                                        <Item.Description>
                                                                            {event.short}
                                                                        </Item.Description>
                                                                        <Item.Extra>
                                                                            <JoinEvent eventKey={event.key} event={event} floated="right" />
                                                                        </Item.Extra>
                                                                    </Transition.Group>
                                                                )

                                                            }
                                                        )
                                                    }
                                                </Segment.Group>
                                            ) : null
                                    }
                                </Item.Content>
                            </Item>
                        )
                    })
                }
            </Transition.Group>
        )
    };

    renderList = () => {

        const { events } = this.props;

        if(!isLoaded(events)) {
            return (
                <Dimmer active inverted>
                    <Loader size="large">Proszę czekać...</Loader>
                </Dimmer>
            )
        }

        let data = [];

        if(!isEmpty(events)) {

            data = Object.keys(events).map((key) => {

                return {
                    key: key,
                    ...events[key]
                };
            });
        }

        const viewType = this.props.filter.viewType || "weeksView";

        switch(viewType) {
            case "weeksView":
                return this.weeksView(data);
            case "listView":
                return this.listView(data);
            default:
                return this.listView(data);
        }
    };

    render() {
        const { router } = this.context;

        return (
            <Container className="events-list">
                <Segment clearing basic>
                    <Button basic onClick={this.props.close} floated="right" icon="x" />
                    <Button basic floated="right" icon="sliders" onClick={() => router.history.replace("/filter")} />
                    <Header floated="left" size="large">
                        Nadchodzące wydarzenia
                    </Header>
                </Segment>
                <Segment basic textAlign="center">
                    {this.renderList()}
                </Segment>
            </Container>
        );
    }
}

EventsList.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = state => {
    return {
        filter: state.filter
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch);
};


export default compose(
    firebaseConnect(),
    connect(({ firebase: { auth } }) => ({ auth })),
    connect(mapStateToProps, mapDispatchToProps)
)(EventsList);
