import React from 'react'
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { GOOGLE_MAP_KEYS } from '../../config/Keys';
import locations from '../../config/Data';

function Map() {
    const [userLocation, setUserLocation] = useState(null);

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


  console.log("Location", userLocation);

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
      googleMapsApiKey={GOOGLE_MAP_KEYS}
      // libraries={libraries}

    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={userLocation}
      >

        {locations.map((location)=>(
            <MarkerF position={{lat:location.lat, lng: location.lng}} title={location.name} />
        ))}

        <MarkerF position={userLocation} title='Ride Location' color="blue" />


      </GoogleMap>
    </LoadScript>

    </div>
  )
}

export default Map
