import React from 'react'
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import { libraries } from './constants';

function Map() {
    const [userLocation, setUserLocation] = useState(null);
    const googleMapsApiKey = import.meta.env.GOOGLE_MAPS_API_KEY;
    console.log("Keys:   ", googleMapsApiKey)

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


  const mapContainerStyle = {
    width: '100vw',
    height: '400px',
  };

  if (!userLocation) {
    return <div>Loading...</div>;
  }
  return (

    <div className='mt-8 rounded w-11/12 ml-4'>
          <LoadScript
      googleMapsApiKey="AIzaSyA1vtpHnKD0nC0yclF-qLnLmW2G3cWbxVs"
    //   libraries={libraries}
    libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={userLocation}
      >
        <Marker position={userLocation} />
      </GoogleMap>
    </LoadScript>

    </div>
  )
}

export default Map
