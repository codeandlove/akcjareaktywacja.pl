import React, { Component } from "react";
import { PropTypes } from "prop-types";

import { firebaseConnect} from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import ReCAPTCHA from "react-google-recaptcha";

import "./Register.scss";

import { Container, Header, Segment, Message, Form, Input, Checkbox, Button, Icon } from "semantic-ui-react";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageType: null,
            terms: true,
            email: null,
            password: null,
            nick: null,
            captcha: false
        }
    }

    handleChange = name => event => {

        this.setState({
            [name]: event.target.value
        });

    };

    renderMessage = () => {
        const { messageType } = this.state;

        let result = null;

        switch(messageType) {
            case "create/nick-duplicated":
                result = (
                    <Message negative>
                        <Message.Header>Błąd rejestracji</Message.Header>
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

    toggleTerms = () => {
        this.setState(s => {
            return {
                terms: !s.terms
            }
        })
    };

    captchaVerifyHandler = () => {
        this.setState({
            captcha: true
        })
    };

    validateValues = (values) => {

        const result = values.filter(val => {
            return this.state[val] === false || this.state[val] === null || !this.state[val];
        });

        return result.length !== 0;
    };

    registerUser = () => {

        const { nick, email, password } = this.state;

        const { firebase } = this.props;

        const { router } = this.context;

        if(this.validateValues(["email", "password", "nick", "terms", "captcha"])) return;

        const usersRef = firebase.database().ref("/users");

        //Check if nick is unique
        usersRef.orderByChild("displayNick").equalTo(nick).once("value").then(snapshot => {

            if(!snapshot.val()) {
                this.props.firebase.createUser({
                    email: email,
                    password: password
                }, {
                    email: email,
                    displayNick: nick
                }).then(() => {
                    router.history.push("/user");
                })
            } else {
                this.setState({
                    messageType: "create/nick-duplicated"
                })
            }
        });

    };

    render() {

        const { terms } = this.state;

        return (
            <Container>
                <Segment clearing basic>
                    <Button basic onClick={() => this.props.close()} floated="right" icon="x" />
                    <Header floated="left" size="large">
                        Rejestracja nowego użytkownika
                    </Header>
                </Segment>
                {this.renderMessage()}
                <Segment basic>
                    <h3>Wypełnij poniższe pola</h3>
                    <Form>
                        <Form.Field required>
                            <label>Twój nick</label>
                            <Input placeholder="Wpisz nick" type="nick" id="nick" name="nick" onChange={this.handleChange("nick")} />
                        </Form.Field>
                        <Form.Field required>
                            <label>Adres email</label>
                            <Input placeholder="Wpisz adres email" type="email" id="email" name="email" onChange={this.handleChange("email")} />
                        </Form.Field>
                        <Form.Field required>
                            <label>Hasło</label>
                            <Input placeholder="Wpisz swoje hasło" type="password" id="password" name="password" onChange={this.handleChange("password")} />
                        </Form.Field>
                        <Form.Field
                            control={Checkbox}
                            label={{ children: "Zgadzam się z ogólnymi warunkami serwisu." }}
                            required
                            inline
                            defaultChecked={terms}
                            onChange={() => this.toggleTerms()}
                        />
                        <Form.Field>
                            <ReCAPTCHA
                                ref="recaptcha"
                                sitekey="6LcFz04UAAAAAJDHq5dZd271YUufgAFjHh02dSOl"
                                onChange={this.captchaVerifyHandler}
                            />
                        </Form.Field>
                        <Form.Field floated="left">
                            <Button as={Link} to="/login" >
                                <Icon name="x" />
                                Anuluj
                            </Button>
                        </Form.Field>
                        <Form.Field control={Button} primary onClick={this.registerUser}  disabled={this.validateValues(["email", "password", "nick", "terms", "captcha"])} floated="right">
                            <Icon name="check" />
                            Wyślij
                        </Form.Field>
                    </Form>
                </Segment>
            </Container>
        );
    }
}

Register.contextTypes = {
    router: PropTypes.object
};

export default compose(
    firebaseConnect(),
    connect(({ firebase: { auth, profile } }) => ({ auth, profile }))
)(Register);