import React, { Component } from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

import renderHTML from "react-render-html";

import JoinEvent from "./../Join/Join";

import { Container, Segment, Header, Button, Icon } from "semantic-ui-react";

class EventPage extends Component {

    componentDidMount() {
        this.props.open();
    }

    renderPage = (data) => {
        const { close } = this.props;

        return (
            <Container fluid className="event-page">
                <Segment clearing basic>
                    <Button basic onClick={close} floated="right" icon="x" />
                    <Header floated="left" size="large">
                        {data.title}
                        <Header.Subheader>
                            Organizator: {data.owner}
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Segment clearing basic>
                    {
                        renderHTML(data.description)
                    }
                </Segment>
                <Segment basic>
                    <Button floated="left" onClick={close} >
                        <Icon name="arrow left" />
                        Wróć
                    </Button>
                    {
                        data.eventKey ? (
                            <JoinEvent eventKey={data.eventKey} event={data} />
                        ): null
                    }
                </Segment>
            </Container>
        )
    };

    render() {

        const { event, isDraft } = this.props;

        if(isDraft) {

            let draft = JSON.parse(localStorage.getItem("eventDraft"));
            
            if(isEmpty(draft)) {
                return (
                    <p>Brak danych</p>
                );
            } else {
                return this.renderPage(draft);
            }
        }

        if(!isLoaded(event)) {
            return null;
        } else {
            const data = Object.assign({eventKey: Object.keys(event)[0]}, Object.values(event)[0]);

            return this.renderPage(data);
        }
    }
}

const enhance = compose(
    firebaseConnect((props) => {

        return ([
            {
                path: "events",
                storeAs: "event",
                queryParams: [ 'orderByChild=slug', `equalTo=${props.match.params.slug}` ]
            }
        ])

    }),
    connect(({ firebase: { data } }) => ({ event: data.event }))
);

export default enhance(EventPage)