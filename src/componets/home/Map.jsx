import React, { useState, useEffect, useRef } from 'react';
import {
    GoogleMap,
    LoadScript,
    MarkerF,
    DirectionsService,
    DirectionsRenderer,
} from '@react-google-maps/api';
import { GOOGLE_MAP_KEYS } from '../../config/Keys';
import locations from '../../config/Data';
import axios from 'axios';

function Map() {
    const [userLocation, setUserLocation] = useState(null);
    const [directions, setDirections] = useState(null);
    const directionsServiceRef = useRef(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error('Error getting location:', error);
            }
        );
    }, []);

    const calculateDirections = async () => {
        if (userLocation) {
            if (!directionsServiceRef.current) {
                directionsServiceRef.current = new window.google.maps.DirectionsService();
            }

            const waypoints = locations.map((location) => ({
                location: { lat: location.lat, lng: location.lng },
            }));
            const request = {
                origin: waypoints[0].location,
                destination: waypoints[waypoints.length - 1].location,
                waypoints: waypoints.slice(1, -1),
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            try {
                const response = await directionsServiceRef.current.route(request);
                if (response.status === 'OK') {
                    setDirections(response);
                } else {
                    console.error(`Error fetching directions: ${response.status}`);
                }
            } catch (error) {
                console.error('Error calculating directions:', error);
            }
        }
    };

    const getDistance = async () => {
        // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLocation.lat},${userLocation.lng}&destinations=${locations[locations.length-1].lat},${locations[locations.length-1].lng}&key=${GOOGLE_MAP_KEYS}`;
        const url = `http://localhost:5000/distance?origins=${userLocation.lat},${userLocation.lng}&destinations=${locations[locations.length-1].lat},${locations[locations.length-1].lng}&key=${GOOGLE_MAP_KEYS}`;
        console.log(url)

        axios.get(url, {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            })
        .then(response => {
          const distance = response.data.rows[0].elements[0].distance.text;
          const time = response.data.rows[0].elements[0].duration.text;
          console.log(`Distance between the two addresses: ${distance} and duration: ${time}`);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    useEffect(() => {
        calculateDirections();
        getDistance();

    }, [userLocation]);

    const mapContainerStyle = {
        width: '100vw',
        height: '400px',
    };

    if (!userLocation) {
        return <div>Loading...</div>;
    }

    return (
        <div className='mt-8 rounded w-11/12 ml-4'>
            <LoadScript googleMapsApiKey={GOOGLE_MAP_KEYS}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={userLocation}
                >
                    {/* {locations.map((location) => (
                        <MarkerF
                            key={location.id || location.name} // Add a unique key if locations lack an 'id'
                            position={{ lat: location.lat, lng: location.lng }}
                            title={location.name}
                        />
                    ))} */}

                    <MarkerF
                        position={userLocation}
                        title='Ride Location'
                        color="blue"
                    />

                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </LoadScript>

            <button onClick={calculateDirections}>Calculate Directions</button>
        </div>
    );
}

export default Map;
