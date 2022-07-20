import React, { useState } from 'react'
import redditIcon from '../images/reddit-icon.png'

const Navbar = () => {

  const [mobileNavLinksVisible, setMobileNavLinksVisible] = useState(false)

  return (
    <div className='font-poppins relative border-b border-slate-200'>
      <header className='flex items-center px-4 py-1 mx-auto'>
        {/* logo and name */}
        <div className='flex items-center gap-2'>
        <img src={redditIcon} className='w-10'></img>
        <h1 className='text-xl md:text-1xl text-gray-700'>!Reddit</h1>
        </div>
        {/* links on desktop */}
        <ul className='flex text-1xl ml-auto gap-6'>
          <button class='hidden md:block w-32 py-1 border-blue-500 font-bold border rounded-full text-blue-500 hover:bg-slate-100 text-sm'>Log In</button>
          <button class='hidden md:block w-32 py-1 bg-blue-500 font-bold border rounded-full text-white hover:bg-blue-400 text-sm'>Sign Up</button>
          <button class='flex justify-center md:border-slate-200 w-20 py-1 border-slate-100 border' onClick={() => setMobileNavLinksVisible(!mobileNavLinksVisible)}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        </ul>
        {/* hamburger menu for mobile */}
        
        {/* dropdown links on mobile */}
      </header>
      { mobileNavLinksVisible ? <ul className='mobileNav flex flex-col justify-evenly absolute right-4 overflow-hidden bg-white rounded-sm z-10 border border-slate-200 text-sm font-bold'>
        <li className='cursor-pointer px-8 py-4 hover:bg-slate-200'>Settings</li>
        <li className='cursor-pointer px-8 py-4 hover:bg-slate-200'>Help Center</li> 
        <li className='cursor-pointer px-8 py-4 hover:bg-slate-200'>{`Terms & Policies`}</li>
        <li className='cursor-pointer px-8 py-4 hover:bg-slate-200'>FAQ's</li>
      </ul> : null}
      {/* dark overlay for page outside of dropdown */}
      { mobileNavLinksVisible ? <button onClick={() => setMobileNavLinksVisible(!mobileNavLinksVisible)} className='fixed top-0 right-0 bottom-0 left-0 h-full w-full cursor-default'></button> : null}
    </div>
  )
}

export default Navbar