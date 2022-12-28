/* eslint-disable react/prop-types */
import React from 'react'

function MobileNavLinks (props) {
  const currentUser = props.currentUser
  const userInfo = props.userInfo
  return (
    <ul className='mobileNav flex flex-col justify-evenly absolute right-4 overflow-hidden bg-white dark:bg-neutral-900 dark:text-white rounded-md z-10 border border-neutral-200 dark:border-neutral-700 text-sm font-medium '>
    {currentUser
      ? <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-neutral-300 dark:hover:bg-neutral-800'>
    <img className='w-6 rounded-full' src={userInfo.profilePicture}></img>
      {userInfo.username}
    </li>
      : null}
    { currentUser
      ? <button onClick={() => props.setCreateCommunityPopUp(true)} className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-neutral-300 dark:hover:bg-neutral-800'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>

      Create a Community
    </button>
      : null}
    <button className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-neutral-300 dark:hover:bg-neutral-800'
    onClick={() => { localStorage.theme !== 'dark' ? localStorage.theme = 'dark' : localStorage.theme = 'light'; window.location.reload() }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      Dark Mode
    </button>
    <div className='w-auto h-px bg-neutral-300 dark:bg-neutral-700'></div>
    <> {!currentUser
      ? <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-neutral-300 dark:hover:bg-neutral-800' onClick={() => { props.setMobileNavLinksVisible(false); props.setLogInPopUp(true) }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
        Sign Up or Log In
      </li>
      : <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-neutral-300 dark:hover:bg-neutral-800' onClick={() => { props.setMobileNavLinksVisible(false); props.logOut() }}>
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
