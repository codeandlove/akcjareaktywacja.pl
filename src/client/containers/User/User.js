import React, { Component } from "react";

import { firebaseConnect} from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Uploader from './../Uploader/Uploader';

import ReCAPTCHA from "react-google-recaptcha";

import avatarPlaceholder from "./../../../assets/profile_avatar.png";

import "./User.scss";

import { Container, Header, Segment, Form, Input, Button, Icon, Message, Image, Tab } from "semantic-ui-react";

class User extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messageType: null,
            email: null,
            password: null,
            nick: null,
            uploader: false,
            captcha: false,
            validated: false
        }
    }

    componentDidMount() {
        const { auth, profile } = this.props;

        if(auth.isLoaded && !auth.isEmpty) {
            this.setState({
                nick: profile.displayNick
            })
        }
    }

    handleChange = name => event => {

        this.setState({
            [name]: event.target.value
        });

    };

    captchaVerifyHandler = () => {
        this.setState({
            captcha: true
        })
    };

    renderMessage = () => {
        const { messageType } = this.state;

        let result = null;

        switch(messageType) {
            case "create/nick-duplicated":
                result = (
                    <Message negative>
                        <Message.Header>Błąd aktualizacji profilu</Message.Header>
                        <p>Użytkownik o takim nicku już istnieje.</p>
                    </Message>
                );
                break;
            default:
                result = null;
                break;
        }

        return (result) ? <Segment clearing basic>{result}</Segment> : null;
    };

    validateValues = (values) => {

        const result = values.filter(val => {
            return this.state[val] === false || this.state[val] === null || !this.state[val];
        });

        return result.length !== 0;
    };

    logoutEvent = () => {
        this.props.firebase.logout();
    };

    toggleUploader = () => {
        this.setState(s => {
            return {
                uploader: !s.uploader
            }
        })
    };

    updateProfile = () => {

        const { auth, firebase } = this.props;
        const { nick } = this.state;

        if(this.validateValues(["nick", "captcha"])) return;

        const usersRef = firebase.database().ref('/users');

        //Check if nick is unique
        usersRef.orderByChild('displayNick').equalTo(nick).once("value").then(snapshot => {

            if(!snapshot.val()) {
                this.props.firebase.update(`users/${auth.uid}`, {
                    displayNick: nick
                });
            } else {
                this.setState({
                    messageType: "create/nick-duplicated"
                })
            }
        });
    };

    userWelcome = () => {
        const { auth } = this.props;
        const { nick } = this.state;

        return (
            <Tab.Pane clearing>
                <Image src={auth.photoURL || avatarPlaceholder} size='small' centered circular />
                <h3>Witaj, {nick || auth.displayName}</h3>
            </Tab.Pane>
        )
    };

    userSettings = () => {
        const { auth, profile } = this.props;
        const { nick, uploader } = this.state;

        return (
            <Tab.Pane clearing>

                <Form>
                    <Form.Field>
                        <Image src={auth.photoURL || avatarPlaceholder} size='mini' avatar onClick={this.toggleUploader} /> {nick || auth.displayName}
                        <Uploader open={uploader} />
                    </Form.Field>
                    <Form.Field>
                        <label>Twój nick</label>
                        <Input ref={el => this.nick = el} placeholder="Wpisz nick" type="text" id="nick" name="nick" value={nick || profile.displayNick || ""} onChange={this.handleChange("nick")} />
                    </Form.Field>
                    <Form.Field>
                        <ReCAPTCHA
                            ref="recaptcha"
                            sitekey="6LcFz04UAAAAAJDHq5dZd271YUufgAFjHh02dSOl"
                            onChange={this.captchaVerifyHandler}
                        />
                    </Form.Field>
                    <Form.Field control={Button} color="olive" disabled={this.validateValues(["nick", "captcha"])} onClick={this.updateProfile} floated="right">
                        <Icon name="check" />
                        Zapisz
                    </Form.Field>
                </Form>
            </Tab.Pane>
        )
    };

    userLogout = () => {
        return (
            <Tab.Pane clearing>
                <Button color="red" onClick={() => this.logoutEvent()} floated="right" >
                    <Icon name="sign out" />
                    Wyloguj się
                </Button>
            </Tab.Pane>
        )
    };

    render() {

        const { auth, profile } = this.props;

        const panes = [
            { menuItem: 'Witaj', render: this.userWelcome },
            { menuItem: 'Twoje konto', render: this.userSettings  },
            { menuItem: 'Wyloguj się', render: this.userLogout }
        ];

        return (
            <Container>
                <Segment clearing basic>
                    <Button basic onClick={() => this.props.close()} floated="right" icon="x" />
                    <Header floated="left" size='large'>
                        Witaj, {profile.displayNick || auth.displayName}!
                    </Header>
                </Segment>
                {this.renderMessage()}
                <Segment basic>
                    <Tab panes={panes} />
                </Segment>
            </Container>
        )
    }
}

export default compose(
    firebaseConnect(),
    connect(({ firebase: { auth, profile } }) => ({ auth, profile }))
)(User);