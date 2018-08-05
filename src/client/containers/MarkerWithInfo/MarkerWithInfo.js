import React, { Component } from 'react';
import { Marker, InfoWindow } from "react-google-maps";

import { Link } from "react-router-dom";

import './MarkerWithInfo.scss';

class MarkerWithInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
    }

    onToggleOpen = () => {

        this.setState(s => {
            return {
                isOpen: !s.isOpen
            }
        })
    };

    render() {

        const { data, position } = this.props;
        const { isOpen } = this.state;

        return (
            <Marker position={position} onClick={this.onToggleOpen}>
                { isOpen &&
                    <InfoWindow onCloseClick={this.onToggleOpen}>
                        <div>
                            <Link to={`event/${data.slug}`}>
                                {data.title}
                            </Link>
                        </div>
                    </InfoWindow>
                }
            </Marker>
        )
    }
}

export default MarkerWithInfo;