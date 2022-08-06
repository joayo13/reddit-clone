import React, { useEffect, useState } from 'react'
import redditIcon from '../images/reddit-icon.png'
import { useAuth } from '../contexts/AuthContext'


const Navbar = (props) => {

  const [mobileNavLinksVisible, setMobileNavLinksVisible] = useState(false)

  const {currentUser, logOut, setUserInfo, userInfo} = useAuth()

  

  return (
    <div className='font-poppins relative border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800'>
      <header className='flex items-center px-4 py-1'>
        {/* logo and name */}
        <div className='flex items-center gap-2'>
        <img src={redditIcon} className='w-10'></img>
        <h1 className='hidden md:block text-1xl font-semibold text-gray-700 dark:text-white'>!Reddit</h1>
        </div>
        {/* search bar */}
        <div className='flex mx-auto gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-2 outline-blue-500 hover:outline outline-1 rounded-md md:w-4/12 w-48 focus-within:outline'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:invert" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type='text' placeholder='Search !Reddit' className='bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none w-full'>
          </input>
        </div>
        {/* sign up and login buttons */}
        <ul className='flex text-1xl gap-2'>
          {currentUser ? null : <>
          <button className='hidden md:block w-32 py-1 border-blue-500 font-bold border rounded-full text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm'
          onClick={()=> props.setLogInPopUp(true)}>Log In</button>
          <button className='hidden md:block w-32 py-1 bg-blue-500 font-bold rounded-full text-white hover:bg-blue-400 text-sm'
          onClick={() => props.setSignUpPopUp(true)}>Sign Up</button>
          </>}
          {/* dropdown menu button */}
          {!currentUser ? 
          <button className='flex justify-center py-1 opacity-50' onClick={() => setMobileNavLinksVisible(!mobileNavLinksVisible)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:invert" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:invert" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button> : 
          <button className='flex relative py-1 px-2 gap-2 justify-start h-full dark:text-white rounded-md' onClick={() => setMobileNavLinksVisible(!mobileNavLinksVisible)}>
            <img className='w-6 hidden md:block rounded-full' src={userInfo.profilePicture}></img>
            <h3 className='hidden md:block text-xs font-semibold'>{userInfo.username}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>} 
        </ul>
      </header>
      {/* dropdown menu contents */}
      { mobileNavLinksVisible ? <ul className='mobileNav flex flex-col justify-evenly absolute right-4 overflow-hidden bg-white dark:bg-slate-900 dark:text-white rounded-md z-10 border border-slate-200 dark:border-slate-700 text-sm font-medium '>
        {currentUser ? <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-slate-200 dark:hover:bg-slate-800'>
        <img className='w-6 rounded-full' src={userInfo.profilePicture}></img>
          {userInfo.username}
        </li> : null}
        <button className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-slate-200 dark:hover:bg-slate-800'
        onClick={() => {localStorage.theme !== 'dark' ? localStorage.theme = 'dark': localStorage.theme='light'; window.location.reload()}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Dark Mode
        </button>
        <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-slate-200 dark:hover:bg-slate-800'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Help Center
        </li> 
        <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-slate-200 dark:hover:bg-slate-800'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          {`Terms & Policies`}
        </li>
        <div className='w-auto h-px bg-slate-200 dark:bg-slate-700'></div>
        <> {!currentUser ? <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-slate-200 dark:hover:bg-slate-800' onClick={() =>{setMobileNavLinksVisible(false); props.setLogInPopUp(true)}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
            Sign Up or Log In
          </li> :
          <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-slate-200 dark:hover:bg-slate-800' onClick={() =>{setMobileNavLinksVisible(false); logOut()}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
            Log Out
          </li> }
          
        </>
      </ul> : null}
      {/* full screen button for disabling dropdown if clicking outside of it */}
      { mobileNavLinksVisible ? <button onClick={() => setMobileNavLinksVisible(!mobileNavLinksVisible)} className='fixed top-0 right-0 bottom-0 left-0 h-full w-full cursor-default'></button> : null}
    </div>
  )
}

export default Navbar