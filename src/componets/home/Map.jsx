import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { GOOGLE_MAP_KEYS } from "../../config/Keys";
import locations from "../../config/Data";
import axios from "axios";
import { BACKEND_URL } from "../../config/Keys";

function Map() {
  const [busLocation, setBusLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const directionsServiceRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [nextStop, setnextStop] = useState(null);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [tripNumber, setTripNumber] = useState(null);
  // const [busStopDistance, setbusStopDistance] = useState(null);

  const generateGoogleMapRoute = async () => {
    if (busLocation) {
      if (!directionsServiceRef.current) {
        directionsServiceRef.current =
          new window.google.maps.DirectionsService();
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
        if (response.status === "OK") {
          setDirections(response);
        } else {
          console.error(`Error fetching directions: ${response.status}`);
        }
      } catch (error) {
        console.error("Error calculating directions:", error);
      }
    }
  };

  const getStatusBarData = async (dest) => {
    localStorage.clear();
    generateGoogleMapRoute(); // display the routes on maps

    var dest_addr_point;
    if (dest == 0) {
      dest_addr_point = locations[0];
      setTripNumber(0);
    } else if (dest == 1) {
      dest_addr_point = locations[locations.length - 1];
      setTripNumber(1);
    } else {
      setTripNumber(null);
      setnextStop(null);
      setDistance(null);
      setTime(null);
      return 0;
    }

    const url = `${BACKEND_URL}/distance?origins=${busLocation.lat},${busLocation.lng}&destinations=${dest_addr_point.lat},${dest_addr_point.lng}&key=${GOOGLE_MAP_KEYS}`;

    axios
      .get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        const myDistanceToDest = parseInt(
          response.data.rows[0].elements[0].distance.value,
          10
        );
        localStorage.setItem("myDistanceToDest", myDistanceToDest);
        // console.log("We go to: ", response.data.destination_addresses)
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    var minDistance = 0;

    let startIndex = dest === 0 ? 0 : locations.length - 1;
    for (
      let i = startIndex;
      dest === 0 ? i < locations.length : i >= 0;
      dest === 0 ? i++ : i--
    ) {
      const myBusStop = locations[i];
      const url = `${BACKEND_URL}/distance?origins=${busLocation.lat},${busLocation.lng}&destinations=${myBusStop.lat},${myBusStop.lng}&key=${GOOGLE_MAP_KEYS}`;

      axios
        .get(url, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          const mylocation = response.data.origin_addresses;
          const mynextbus = response.data.destination_addresses;
          const mydistance = parseInt(
            response.data.rows[0].elements[0].distance.value,
            10
          );
          const mytime = response.data.rows[0].elements[0].duration.value;

          // console.log("Compare: ", mydistance, minDistance);
          if (mydistance < minDistance || minDistance == 0) {
            // check if the bus didn't pass on this bus stop
            const url = `${BACKEND_URL}/distance?origins=${myBusStop.lat},${myBusStop.lng}&destinations=${dest_addr_point.lat},${dest_addr_point.lng}&key=${GOOGLE_MAP_KEYS}`;

            axios
              .get(url, {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                },
              })
              .then((response) => {
                const stopDistanceToDest = parseInt(
                  response.data.rows[0].elements[0].distance.value,
                  10
                );
                console.log(response.data.destination_addresses);
                localStorage.setItem("stopDistanceToDest", stopDistanceToDest);
              })
              .catch((error) => {
                console.error("Error:", error);
              });

            var stopDistanceToDest = localStorage.getItem("stopDistanceToDest");
            var myDistanceToDest = localStorage.getItem("myDistanceToDest");

            // console.log("Compare: ", stopDistanceToDest, myDistanceToDest);
            if (stopDistanceToDest <= myDistanceToDest) {
              minDistance = mydistance;
              setLocation(mylocation);
              setnextStop(mynextbus);
              setTime(mytime);
              setDistance(mydistance);
              // console.log( `Name is: ${mynextbus} Distance is: ${mydistance} and duration: ${mytime}` );
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;
      setBusLocation({ lat: latitude, lng: longitude });
    };
    const watchId = navigator.geolocation.watchPosition(updateLocation);
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const isMobile = window.innerWidth <= 768;
  const mapContainerStyle = {
    width: isMobile ? "86vw" : "56vw",
    height: "420px",
  };

  if (!busLocation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <>
      <div className="md:flex mb-16 md:mb-1">
        <div className="px-4 pt-4 md:w-5/12">
          <div className="text-xl md:ml-8 text-gray-700 font-extrabold md:mb-6 md:mt-6 uppercase underline underline-offset-4">
            {" "}
            {tripNumber ? "Ride tracking Details" : "Ride tracking app"}
          </div>

          <div className="md:flex md:ml-8 text-gray-600 flex-col w-11/12 md:w-full">
            <div className="pr-4 md:px-0 mb-2 mt-3 md:mt-0 md:mb-0 md:mr-2 md:w-auto">
              <span className="font-semibold  md:my-4"> Trip: </span>{" "}
              {tripNumber == 0 || tripNumber == 1 ? (
                <span>
                  {" "}
                  {tripNumber == 0
                    ? "Kimironko - Nyabugogo"
                    : "Nyabugogo - Kimironko"}
                </span>
              ) : (
                <span> _ _ _</span>
              )}
            </div>
            <div className="md:my-4 mb-2 md:mb-0 md:mr-2 md:w-auto">
              <span className="font-semibold  md:my-4">Current Location: </span>{" "}
              {location}
            </div>
            <div className="md:my-4 mb-2 md:mb-0 md:mr-2 md:w-auto">
              <span className="font-semibold">Next Bus Stop: </span>{" "}
              {nextStop != null ? nextStop : " _"}
            </div>
            <div className="  md:my-4 mb-2 md:mb-0 md:mr-2 md:w-auto">
              <span className="font-semibold">Distance Left: </span>{" "}
              {(distance / 1000).toFixed(1)} Km
            </div>
            <div className=" md:my-4 mb-2 md:mb-0 md:mr-2 md:w-auto">
              <span className="font-semibold">Time remaining: </span>{" "}
              {(time / 60).toFixed(0)} minutes
            </div>

            {tripNumber != 0 && tripNumber != 1 ? (
              <div className="mb-2  mt-6">
                <div className="mb-4 md:mt-4 underline underline-offset-4 text-gray-700">
                  {" "}
                  Where is your destination address?{" "}
                </div>
                <button
                  className="py-2 px-4 rounded bg-gradient-to-br from-lime-500 to-teal-500 text-gray-100 font-semibold"
                  onClick={() => getStatusBarData(0)}
                >
                  {" "}
                  Nyabugogo{" "}
                </button>
                <span className="mx-2"> or </span>
                <button
                  className="py-2 px-4 rounded bg-gradient-to-br from-teal-500 to-lime-500 text-gray-100 font-semibold"
                  onClick={() => getStatusBarData(1)}
                >
                  {" "}
                  Kimironko{" "}
                </button>{" "}
              </div>
            ) : (
              <>
                <button
                  className="py-2 px-4 md:mt-16 max-w-56 rounded bg-gradient-to-br from-red-500 to-orange-500 text-gray-100 font-semibold"
                  onClick={() => getStatusBarData(null)}
                >
                  {" "}
                  Reset{" "}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Google map  */}
        <div className="mt-8 rounded w-6/12 ml-4">
          <LoadScript googleMapsApiKey={GOOGLE_MAP_KEYS}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={12}
              center={busLocation}
            >
              {/*
            {locations.map((location) => (
              <MarkerF
                key={location.id || location.name} // Add a unique key if locations lack an 'id'
                position={{ lat: location.lat, lng: location.lng }}
                title={location.name}
              />
            ))}
            */}
              <MarkerF
                position={busLocation}
                title="Ride Location"
                color="blue"
              />

              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
}

export default Map;
