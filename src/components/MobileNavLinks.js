/* eslint-disable react/prop-types */
import React from 'react'

function MobileNavLinks (props) {
  const currentUser = props.currentUser
  const userInfo = props.userInfo
  return (
    <ul className='mobileNav flex flex-col justify-evenly absolute right-4 overflow-hidden bg-white dark:bg-gray-900 dark:text-white rounded-md z-10 border border-gray-200 dark:border-gray-700 text-sm font-medium '>
    {currentUser
      ? <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-gray-300 dark:hover:bg-gray-800'>
    <img className='w-6 rounded-full' src={userInfo.profilePicture}></img>
      {userInfo.username}
    </li>
      : null}
    { currentUser
      ? <button onClick={() => props.setCreateCommunityPopUp(true)} className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-gray-300 dark:hover:bg-gray-800'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Create a Community
    </button>
      : null}
    <button className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-gray-300 dark:hover:bg-gray-800'
    onClick={() => { localStorage.theme !== 'dark' ? localStorage.theme = 'dark' : localStorage.theme = 'light'; window.location.reload() }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      Dark Mode
    </button>
    <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-gray-300 dark:hover:bg-gray-800'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Help Center
    </li>
    <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-gray-300 dark:hover:bg-gray-800'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      {'Terms & Policies'}
    </li>
    <div className='w-auto h-px bg-gray-300 dark:bg-gray-700'></div>
    <> {!currentUser
      ? <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-gray-300 dark:hover:bg-gray-800' onClick={() => { props.setMobileNavLinksVisible(false); props.setLogInPopUp(true) }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
        Sign Up or Log In
      </li>
      : <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-gray-300 dark:hover:bg-gray-800' onClick={() => { props.setMobileNavLinksVisible(false); props.logOut() }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
        Log Out
      </li> }
    </>
  </ul>
  )
}

export default MobileNavLinks
