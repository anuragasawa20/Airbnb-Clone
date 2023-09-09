import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import ReactMapGL from 'react-map-gl';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import PropTypes from 'prop-types';

function Map({ searchLocation }) {
    console.log(searchLocation);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(139.753);
    const [lat] = useState(35.6844);
    const [zoom] = useState(14);
    const [API_KEY] = useState('5Bja0rz6qmWq5Z6nGvGt');
    // const [searchLocation, setSearchLocation] = useState('');
    const [locationCoordinates, setLocationCoordinates] = useState([51.505, -0.09]);
    const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
    const [mapKey, setMapKey] = useState(0);

    useEffect(() => {
        updateMapKey();
    }, [locationCoordinates]);
    const updateMapKey = () => {
        setMapKey((prevKey) => prevKey + 1);
    };

    useEffect(() => {
        const handleSearch = async () => {
            console.log(searchLocation);
            try {
                if (searchLocation?.trim() === '') {
                    // If the searchLocation is empty, set the coordinates back to default.
                    setLocationCoordinates(markerPosition);
                    return;
                }
                if (searchLocation !== undefined) {
                    axios
                        .get(`/search/${searchLocation}`)
                        .then((response) => {
                            const { lat, lon } = response.data[0];
                            console.log(lat, lon);
                            // Update both locationCoordinates and markerPosition with the new coordinates.
                            setLocationCoordinates([parseFloat(lat), parseFloat(lon)]);
                            setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
                        })
                        .catch((error) => {
                            console.error('Error fetching location data:', error);
                        });
                }

                // const response = await axios.get(
                //     `/search/${searchLocation}`
                // )
                // const { lat, lon } = response.data[0];
                // console.log(lat, lon);
                // 
                // setLocationCoordinates([parseFloat(lat), parseFloat(lon)]);
                // setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };

        handleSearch();
    }, [searchLocation]);

    // useEffect(() => {
    //     // After the map is initially rendered, update the map's center and zoom level based on the marker's position.
    //     setLocationCoordinates(markerPosition);
    // }, [markerPosition]);
    // useEffect(() => {
    //     console.log(locationCoordinates)
    // }, [locationCoordinates])

    const maptilerApiKey = '5Bja0rz6qmWq5Z6nGvGt';

    const handleMarkerDragEnd = (event) => {
        const { lat, lng } = event.target.getLatLng();
        setMarkerPosition([lat, lng]);
    };

    return (
        <div className="mt-2 ">
            <MapContainer key={mapKey} center={locationCoordinates} zoom={13} style={{ height: '500px', width: '100%' }}>
                {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                <TileLayer url="https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=pk.d5596032cce2addcad7cd4481ec4599b" />
                <Marker position={markerPosition}
                    draggable={true}
                    onDragend={handleMarkerDragEnd}
                >
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}


Map.propTypes = {
    searchLocation: PropTypes.string.isRequired,
};

export default Map;
