import React, { Component } from "react";
import { PropTypes } from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./../../actions/filter";

import ChatForm from './../ChatForm/ChatForm';

import moment from 'moment';

import avatarPlaceholder from "./../../../assets/profile_avatar.png";

import { Container, Segment, Header, Button, Comment } from "semantic-ui-react";

import "./Chat.scss";

class Chat extends Component {

    componentWillReceiveProps() {

        this.scrollToBottom();
    }

    scrollToBottom = () => {

        this.el.scrollIntoView({ behavior: 'smooth' });
    };

    render () {
        const { data } = this.props;

        return (
            <Container className="chat-wrapper">
                <Segment clearing basic>
                    <Button basic onClick={this.props.close} key="close-event-list" floated="right" icon="x" />
                    <Button basic floated="right" icon="window restore" onClick={() => this.props.setChatMode('detached')} />
                    <Header floated="left" size="large">
                        Chat
                    </Header>
                </Segment>
                <Segment clearing basic className="chat-comments-wrapper">
                    <div className="chat-comments-container">
                        {
                            !!data ? (
                                <Comment.Group>
                                    {
                                        Object.keys(data).map(key => {
                                            const res = data[key];

                                            let userAvatar = null;

                                            if(!!res.user) {
                                                userAvatar = res.user.avatarUrl;
                                            }

                                            return (
                                                <Segment key={`comment-${key}`} color="olive">
                                                    <Comment>
                                                        <Comment.Avatar as='div' src={userAvatar || avatarPlaceholder} />
                                                        <Comment.Content>
                                                            <Comment.Author as='strong'>
                                                                {res.nick}
                                                            </Comment.Author>
                                                            <Comment.Metadata>
                                                                {`Wysłano: ${moment(res.timestamp).format("DD MMMM YYYY, h:mm:ss")}`}
                                                            </Comment.Metadata>
                                                            <Comment.Text>
                                                                {res.message}
                                                            </Comment.Text>
                                                        </Comment.Content>
                                                    </Comment>
                                                </Segment>
                                            );
                                        })
                                    }
                                </Comment.Group>
                            ) : null
                        }
                        <div className="to-scroll" ref={el => { this.el = el; }}></div>
                    </div>
                </Segment>
                <Segment basic className="chat-form-wrapper">
                    <ChatForm scrollToBottom={this.scrollToBottom} />
                </Segment>
            </Container>
        )
    }
}

Chat.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
