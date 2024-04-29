import React from 'react'

function Header() {
  return (
    <div className="py-4 h-12 capitalize bg-green-200 flex justify-between items-center w-full text-xl">
        <ul className='flex ml-4'>
            <li className='px-4'> Track </li>
            <li className='px-4'> About </li>
        </ul>

        <div className='mr-16'>
            Startup
        </div>
    </div>

  )
}

export default Header
