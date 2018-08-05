import React, { Component } from "react";
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from "react-google-maps";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import MarkerWithInfo from "./../MarkerWithInfo/MarkerWithInfo";
import "./Map.scss";

const mapStyle = require("./style/style.json");

class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultCoordinates: {
                lat: 51.110,
                lng: 17.036
            },
            markers: [],
            marker: null,
            event: null
        }
    }

    componentWillReceiveProps(props) {
        if(props.events && Object.keys(props.events).length > this.state.markers.length) {
            const receivedMarkers = Object.keys(props.events).map((key) => {
                const event = props.events[key];

                return <MarkerWithInfo key={`marker-${key}`} position={event.coordinates} data={event} viewEvent={() => this.props.viewEvent(key)}/>;
            });

            this.setState({
                markers: receivedMarkers,
                marker: null
            })
        }

        if(props.event) {
            this.setState({
                event: props.event,
                marker: [<Marker key={`new-marker`} position={props.event.coordinates} />],
                defaultCoordinates: props.event.coordinates
            })
        } else {
            this.setState({
                event: null,
                marker: null
            });
        }
    }

    render() {

        const { defaultCoordinates, markers, marker } = this.state;

        const { addEvent } = this.props;

        return (
            <div className="map">
                <MapComponent
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCr9-6MJQJ6wnM46TyfMx2XkY8adleOhLg&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%`, width: `100%` }} />}
                    mapElement={<div style={{ height: `100%`, width: `100%` }} />}
                    defaultCoordinates={defaultCoordinates}
                    openEventForm={addEvent}
                    markers={markers}
                    marker={marker}
                />
            </div>
        );
    }
}

const MapComponent = withScriptjs(withGoogleMap((props) => {

    return (
        <GoogleMap
            defaultOptions={{ styles: mapStyle }}
            defaultZoom={14}
            defaultCenter={props.defaultCoordinates}
            center={props.defaultCoordinates}
            onClick={e => props.openEventForm(e)}
        >
            {props.isMarkerShown && props.marker}

            <MarkerClusterer
                averageCenter
                enableRetinaIcons
                gridSize={60}
            >
                {props.isMarkerShown && props.markers}
            </MarkerClusterer>
        </GoogleMap>
    )
}));


export default Map;
