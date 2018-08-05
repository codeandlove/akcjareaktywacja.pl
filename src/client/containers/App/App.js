import React, { Component } from "react";
import { PropTypes } from "prop-types";

import { withScriptjs } from "react-google-maps";

import { connect } from "react-redux";
import { compose, withProps } from "recompose";
import { firebaseConnect, isEmpty, populate } from "react-redux-firebase";
import { Link } from "react-router-dom";

import logo from "./../../../assets/logo.jpg";
import picture from "./../../../assets/picture.jpg";
import avatarPlaceholder from "./../../../assets/profile_avatar.png";

import Layout from "./../Layout/Layout";
import Map from "./../Map/Map";
import Chat from "./../Chat/Chat";

import { Sidebar, Menu, Icon, Popup, Image, Rail } from "semantic-ui-react";

import { setClientIp } from "./../../actions/client";

import "./App.scss";

const populates = [
    { child: "participants", root: "users", keyProp: "uid" }, // replace participants with user object
    { child: "user", root: "users", keyProp: "uid" } // replace participants with user object
];

class App extends Component {
    constructor() {
        super();

        this.state = {
            auth: null,
            isColOpen: true,
            isColExpanded: false,
            isPageOpen: false,
            eventKey: null,
            menuVisible: false,
            event: null,
            events: null,
            chat: null
        }
    }

    componentDidMount() {

        fetch('https://us-central1-akcjareaktywacja-39acb.cloudfunctions.net/get_ip').then(res => {
            return res.text();
        }).then(ip => {
            this.props.setClientIp(ip);
        });

    }

    componentWillReceiveProps(props) {

        const { events, chat, auth} = props;

        this.setState({
            events: events,
            chat: chat,
            auth: auth
        });
    }

    toggleMenu = () => {
        this.setState(s => {
            return {
                menuVisible: !s.menuVisible
            }
        });
    };

    toggleColExpanded = () => {
        this.setState(s => {
            return {
                isColExpanded: !s.isColExpanded
            }
        })
    };

    togglePage = (toggle, redirect) => {

        const { router } = this.context;

        this.setState(s => {
            return {
                menuVisible: false,
                isPageOpen: toggle,
                eventKey: !toggle ? null : s.eventKey
            }
        }, () => {
            if(redirect){
                router.history.push(redirect)
            }
        });

    };

    toggleColumn = toggle => {
        const { router } = this.context;

        this.setState({
            menuVisible: false,
            isColExpanded: false,
            isColOpen: toggle
        }, () => {
            this.togglePage(false);

            if(!toggle) {
                router.history.push("/");
            }
        });
    };

    updateEvent = props => {

        this.setState(s => {
            return {
                event: {...s.event, ...props}
            }
        })
    };

    openEventForm = props => {
        const { router } = this.context;

        const latLng = props.latLng;

        this.setState({
            isColOpen: true,
            isColExpanded: false,
            event: {
                coordinates: {
                    lat: latLng.lat(),
                    lng: latLng.lng()
                }
            }
        }, () => router.history.replace("/eventForm"));
    };

    closeEventForm = () => {
        const { router } = this.context;

        this.setState({
            isColOpen: false,
            isColExpanded: false,
            event: null
        }, () => router.history.push("/"))
    };

    handleSaveEvent = props => {
        const { router } = this.context;

        this.props.firebase.push("events", props).then(() => {
            this.setState({
                isColExpanded: false
            }, () => router.history.push("/"))
        });
    };

    render() {
        const { events, event, chat, menuVisible, auth } = this.state;

        const { profile, filter: {chat_mode} } = this.props;

        return (
            <div className="app">
                <Menu borderless>
                    <Menu.Item
                        onClick={this.toggleMenu}
                    >
                        <Icon name="bars" />
                    </Menu.Item>
                    <Menu.Item
                        header
                        className="logo-item"
                        as={Link}
                        to="/"
                    >
                        <img src={logo} className="logo" alt="Akcjareaktywacja.pl" title="Akcjareaktywacja.pl" />
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Popup
                            trigger={
                                <div className="picture-logo">
                                    <img src={picture} className="picture-img" alt="Wyjdź z domu i poznaj nowych ludzi. Grupowe spotkania na żywo." title="Wyjdź z domu i poznaj nowych ludzi. Grupowe spotkania na żywo." />
                                </div>
                            }
                            content="Wyjdź z domu i poznaj nowych ludzi. Grupowe spotkania na żywo."
                            position="bottom center"
                        />
                        {
                            isEmpty(auth) || auth.isAnonymous ? [
                                <Menu.Item
                                    key="add-event-form-nav"
                                    className="add-event-item"
                                    name="addEvent"
                                    as={Link}
                                    to="/eventForm"
                                    onClick={() => this.toggleColumn(true)}
                                >
                                    <Icon name="plus circle" size="large" color="olive" />
                                    <span>Dodaj wydarzenie</span>
                                </Menu.Item>,
                                <Menu.Item
                                    key="user-login-nav"
                                    className="login-item"
                                    name="login"
                                    as={Link}
                                    to="/login"
                                    onClick={() => this.toggleColumn(true)}
                                >
                                    <Icon name="user circle" size="large" color="olive" />
                                    <span>Zaloguj się</span>
                                </Menu.Item>
                            ] : [
                                <Menu.Item
                                    key="user-area-nav"
                                    className="logout-item"
                                    name="logout"
                                    as={Link}
                                    to="/user"
                                    onClick={() => this.toggleColumn(true)}
                                >
                                    <Image src={auth.photoURL || avatarPlaceholder} avatar />
                                    <span>Witaj, {profile.displayNick || profile.displayName}</span>
                                </Menu.Item>
                            ]
                        }

                    </Menu.Menu>
                </Menu>
                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        className="sidebar-left"
                        animation="push"
                        width="thin"
                        direction="left"
                        visible={menuVisible}
                        icon="labeled"
                        vertical
                    >
                        <Menu.Item
                            name="events"
                            as={Link}
                            to="/list"
                            onClick={() => this.toggleColumn(true)}
                        >
                            <Icon name="calendar" className="outline" />
                            Nadchodzące wydarzenia
                        </Menu.Item>
                        <Menu.Item
                            name="chat"
                            as={Link}
                            to="/chat"
                            onClick={() => this.toggleColumn(true)}
                        >
                            <Icon name="comments" className="outline" />
                            Chat
                        </Menu.Item>
                        <Menu.Item
                            name="filter"
                            as={Link}
                            to="/filter"
                            onClick={() => this.setState({menuVisible: false})}
                        >
                            <Icon name="sliders" className="outline" />
                            Filtry
                        </Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Sidebar.Pushable>
                            {
                                (chat_mode === 'detached') ?
                                    <Rail attached internal position='right' className="detached-chat">
                                        <Chat data={chat} />
                                    </Rail>
                                    :
                                    null
                            }
                            <Layout
                                {...this.state}
                                auth={auth}
                                colClose={() => this.toggleColumn(false)}
                                pageClose={() => this.togglePage(false, "/")}
                                pageOpen={() => this.togglePage(true, false)}
                                toggleColExpand={this.toggleColExpanded}
                                formCancel={this.closeEventForm}
                                saveEvent={props => this.handleSaveEvent(props)}
                                updateEvent={props => this.updateEvent(props)}
                                toggleFilters={this.toggleFilters}
                            >
                                <Map events={events} event={event} addEvent={props => this.openEventForm(props)} viewEvent={key => this.viewEvent(key)} />
                            </Layout>
                        </Sidebar.Pushable>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );

    }
}

App.contextTypes = {
    router: PropTypes.object
};

const mapDispatchToProps = (dispatch) => {
    return {
        setClientIp: (ip) => dispatch(setClientIp(ip))
    }
};

const enhance = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCr9-6MJQJ6wnM46TyfMx2XkY8adleOhLg&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `0` }} />,
        containerElement: <div style={{ height: `0` }} />,
    }),
    firebaseConnect((props, store) => {

        const { filter } = store.getState();

        const eventsQueryParams = [
            `startAt=${filter.date_from}`, // 123 is treated as a number instead of a string
            `endAt=${filter.date_to}`,
            "orderByChild=date",
        ];

        return [
            { path: "/events", queryParams: eventsQueryParams, populates },
            { path: "/chat", queryParams: ["orderByChild=date", "limitToLast=10"], populates },
        ]
    }),
    connect(({ firebase, filter, client }) => ({
        events: populate(firebase, "events", populates),
        chat: populate(firebase, "chat", populates),
        auth: firebase.auth,
        profile: firebase.profile,
        filter: filter,
        client: client
    }), mapDispatchToProps)
);

export default enhance(withScriptjs(App));

