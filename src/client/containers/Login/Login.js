import React, { Component } from "react";
import PropTypes from "prop-types";

import { firebaseConnect} from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import "./Login.scss";

import { Container, Header, Segment, Message, Form, Input, Button, Icon, Divider } from "semantic-ui-react";

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messageType: null,
            login: null,
            password: null,
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
            case "auth/wrong-password":
                result = (
                    <Message negative>
                        <Message.Header>Błąd logowania</Message.Header>
                        <p>Twoje hasło lub email są niepoprawne. Spróbuj ponownie.</p>
                    </Message>
                );
                break;
            default:
                result = null;
                break;
        }

        return (result) ? <Segment clearing basic>{result}</Segment> : null;
    };

    registerProviderEvent = provider => {
        const { router } = this.context;

        this.props.firebase.login({ provider: provider, type: 'popup' }).then(() => {
            router.history.push("/user");
        })
    };

    loginEvent = () => {
        const { router } = this.context;

        const { email, password } = this.state;

        this.props.firebase.login({
            email: email,
            password: password
        }).then(() => {
            router.history.push("/user");
        }).catch(error => {
            this.setState({
                messageType: error.code
            });
        })
    };

    captchaVerifyHandler = () => {
        this.setState({
            captcha: true
        })
    };

    render() {

        return (
            <Container>
                <Segment clearing basic>
                    <Button basic onClick={() => this.props.close()} floated="right" icon="x" />
                    <Header floated="left" size='large'>
                        Zaloguj się lub zarejestruj
                    </Header>
                </Segment>
                {this.renderMessage()}
                <Segment basic clearing>
                    <h3>Zaloguj się</h3>
                    <Form>
                        <Form.Field required>
                            <label>Adres email</label>
                            <Input placeholder="Wpisz adres email" type="email" id="email" name="email" onChange={this.handleChange("email")} />
                        </Form.Field>
                        <Form.Field required>
                            <label>Hasło</label>
                            <Input placeholder="Wpisz swoje hasło" type="password" id="password" name="password" onChange={this.handleChange("password")} />
                        </Form.Field>
                        <Link to="/reset">Zresetuj swoje hasło</Link>
                        <Form.Field control={Button} primary onClick={this.loginEvent} floated="right">
                            <Icon name="sign in" />
                            Zaloguj się
                        </Form.Field>
                    </Form>
                </Segment>
                <Divider horizontal>Lub</Divider>
                <Segment basic >
                    <h3>Zarejestruj się</h3>
                    <p>Nie masz jeszcze konta? Zarejestruj się już dziś!</p>

                    <Button primary floated="left" as={Link} to="/register">
                        <Icon name="signup" />
                        Utwórz nowe konto
                    </Button>


                    <Form.Field control={Button} color="red" onClick={() => this.registerProviderEvent('google')} floated="right">
                        <Icon name="google" />
                        Zaloguj się przez google
                    </Form.Field>
                </Segment>
            </Container>
        );
    }
}

Login.contextTypes = {
    router: PropTypes.object
};

export default compose(
    firebaseConnect(),
    connect(({ firebase: { auth, profile } }) => ({ auth, profile }))
)(Login);