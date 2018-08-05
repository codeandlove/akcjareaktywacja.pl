import React, { Component } from "react";
import { PropTypes } from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./../../actions/filter";

import DatePicker from "react-datepicker";

import { Form, Radio, Input, Modal, Header, Button, Icon } from "semantic-ui-react";

class Filters extends Component {

    componentWillUnmount() {

        const { filter } = this.props;

        const data = {
            ...filter,
            date_from: filter.date_from.valueOf(),
            date_to: filter.date_to.valueOf(),
        };

        localStorage.setItem('data', JSON.stringify(data));
    }

    close = () => {
        const { router } = this.context;

        router.history.replace('/');
    };

    changeViewType = (e, { value }) => {
        this.props.setViewType(value);
    };

    handleChange = name => event => {

        switch(name) {
            case "dateFrom":
                this.props.setDateFrom(event);
                break;
            case "dateTo":
                console.log(event);
                this.props.setDateTo(event);
                break;
            default:
                this.setState({
                    [name]: event.target.value
                });
        }
    };

    render() {
        const {filter: {viewType, date_from, date_to}} = this.props;

        return (
            <Modal
                open={true}
            >
                <Header icon="sliders" content="Ustawienia" />
                <Modal.Content>
                    <h3>Filtry</h3>
                    <Form>
                        <Form.Group>
                            <Form.Field>
                                <label>Widok:</label>
                            </Form.Field>
                            <Form.Field>
                                <Radio label="Tygodnie" name="viewGroup" value="weeksView" checked={viewType === "weeksView"} onChange={this.changeViewType}/>
                            </Form.Field>
                            <Form.Field>
                                <Radio label="List" name="viewGroup" value="listView" checked={viewType === "listView"} onChange={this.changeViewType}/>
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Data początkowa:</label>

                                <DatePicker
                                    customInput={<DateFrom />}
                                    selected={date_from}
                                    onChange={this.handleChange("dateFrom")}
                                    dateFormat="LL"
                                    locale="pl"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Data końcowa:</label>
                                <DatePicker
                                    customInput={<DateTo />}
                                    selected={date_to}
                                    onChange={this.handleChange("dateTo")}
                                    dateFormat="LL"
                                    locale="pl"
                                />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={this.close}>
                        <Icon name="checkmark" /> Zastosuj
                    </Button>
                </Modal.Actions>
            </Modal>
        )

    }
}

class DateFrom extends Component {
    render() {
        return <Input placeholder="Data początkowa:" type="text" id="date_from" name="date_from" value={this.props.value} onClick={this.props.onClick} onFocus={this.props.onClick} />
    }
}

class DateTo extends Component {
    render() {
        return <Input placeholder="Data końcowa:" type="text" id="date_to" name="date_to" value={this.props.value} onClick={this.props.onClick} onFocus={this.props.onClick} />
    }
}

Filters.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Filters);

