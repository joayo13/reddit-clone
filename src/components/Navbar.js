import React, { useEffect, useState } from 'react'
import redditIcon from '../images/reddit-icon.png'
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase'

const Navbar = (props) => {

  const [mobileNavLinksVisible, setMobileNavLinksVisible] = useState(false)

  const [userInfo, setUserInfo] = useState({})

  const {currentUser, logOut} = useAuth()

  async function fetchUserData () {
    const docRef = doc(db, "users", currentUser.email);

    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        setUserInfo({
          profilePicture: docSnap.data().profilePicture,
          username: docSnap.data().username
        })
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (currentUser)
    fetchUserData()
  },[currentUser])

  return (
    <div className='font-poppins relative border-b border-slate-200 dark:bg-slate-900'>
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
          <button className='flex relative py-1 px-2 gap-2 justify-start border h-full border-white hover:border-slate-200 rounded-md' onClick={() => setMobileNavLinksVisible(!mobileNavLinksVisible)}>
            <img className='w-6 hidden md:block rounded-full' src={userInfo.profilePicture}></img>
            <h3 className='hidden md:block text-xs font-semibold'>{userInfo.username}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>} 
        </ul>
      </header>
      {/* dropdown menu contents */}
      { mobileNavLinksVisible ? <ul className='mobileNav flex flex-col justify-evenly absolute right-4 overflow-hidden bg-white dark:bg-slate-900 dark:text-white rounded-md z-10 border border-slate-200 text-sm font-medium '>
        { currentUser ? <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-slate-200'>
        <img className='w-6 rounded-full' src={userInfo.profilePicture}></img>
          {userInfo.username}
        </li> : null}
        <li className='flex gap-2 items-center cursor-pointer px-2 py-4 hover:bg-slate-200 dark:hover:bg-slate-800'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </li>
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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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