import React, { useState } from 'react'

function StatusBar() {
   const [location, setLocation] = useState("Nyabugogo");
   const [nextStop, setnextStop] = useState("Kacyiru");
   const [distance, setDistance] = useState("300");
   const [time, setTime] = useState("40");

  return (
    <>
    <div className='flex '>
        <div className='px-4'> <span className='text-xl'>Current Location: </span> {location} </div>
        <div className='px-4'> <span className='text-xl'>Next Bus Stop: </span> {nextStop} </div>
        <div className='px-4'> <span className='text-xl'>Distance: </span> {distance} km </div>
        <div className='px-4'> <span className='text-xl'>Time: </span> {time} Minutes </div>
    </div>

    </>
  )
}

export default StatusBar
