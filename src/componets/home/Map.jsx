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
    const [location, setLocation] = useState(null);
    const [nextStop, setnextStop] = useState(null);
    const [distance, setDistance] = useState(null);
    const [time, setTime] = useState(null);
    const [busStopDistance, setbusStopDistance] = useState(null);

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

    const generateGoogleMapRoute = async () => {
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

    const getStatusBarData = async (dest) => {
        generateGoogleMapRoute(); // display the routes on maps


        var dest_addr_point
        if (dest == 0){
            dest_addr_point = locations[0]
        }else{
            dest_addr_point = locations[locations.length -1]
        }

        const url = `http://localhost:5000/distance?origins=${userLocation.lat},${userLocation.lng}&destinations=${dest_addr_point.lat},${dest_addr_point.lng}&key=${GOOGLE_MAP_KEYS}`;

        axios.get(url, {
            headers: {
            'Access-Control-Allow-Origin': '*',
            },
            })
        .then(response => {
        const mydistance = parseInt(response.data.rows[0].elements[0].distance.value,10);
        })
        .catch(error => {
        console.error('Error:', error);
        });



        var minDistance = 0;
        for (const myBusStop of locations) {
            const url = `http://localhost:5000/distance?origins=${userLocation.lat},${userLocation.lng}&destinations=${myBusStop.lat},${myBusStop.lng}&key=${GOOGLE_MAP_KEYS}`;

            axios.get(url, {
                headers: {
                'Access-Control-Allow-Origin': '*',
                },
                })
            .then(response => {
            const mylocation = response.data.origin_addresses;
            const mynextbus = response.data.destination_addresses;
            const mydistance = parseInt(response.data.rows[0].elements[0].distance.value,10);
            const mytime = response.data.rows[0].elements[0].duration.value;

            // console.log("Compare: ", mydistance, minDistance);
            if(mydistance < minDistance || minDistance == 0) {
                minDistance = mydistance;
                setLocation(mylocation);
                setnextStop(mynextbus);
                setTime(mytime);
                setDistance(mydistance);
              console.log(`Name is: ${mynextbus} Distance is: ${mydistance} and duration: ${mytime}`);
            }
            })
            .catch(error => {
            console.error('Error:', error);
            });
        }
        // console.log(nextStop);

    }

    // useEffect(() => {
    //     generateGoogleMapRoute();

    // }, [userLocation]);

    useEffect(() => {
        const updateLocation = (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
        };
        const watchId = navigator.geolocation.watchPosition(updateLocation);
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const mapContainerStyle = {
        width: '100vw',
        height: '400px',
    };

    if (!userLocation) {
        return <div>Loading...</div>;
    }

    return (
        <>

        <div className='flex pl-4'>
            <div className='px-4'> <span className='text-xl'>Current Location: </span> {location} </div>
            <div className='px-4'> <span className='text-xl'>Next Bus Stop: </span> {nextStop} </div>
            <div className='px-4'> <span className='text-xl'>Distance: </span> {(distance/1000).toFixed(1)} Km</div>
            <div className='px-4'> <span className='text-xl'>Time: </span> {(time/60).toFixed(0)} minutes </div>
        </div>

        {/* Google map  */}
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

            <button onClick={()=> getStatusBarData(0)}>Start Journey</button>
        </div>

        </>
    );
}

export default Map;
