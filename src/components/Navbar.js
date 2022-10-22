import React, { useEffect, useState } from 'react'
import redditIcon from '../images/reddit-icon.png'
import { useAuth } from '../contexts/AuthContext'
import MobileNavLinks from './MobileNavLinks'
import { useNavigate } from 'react-router-dom'
import { searchSubreddit } from '../helpers/searchFunctions'


const Navbar = (props) => {

  const navigate = useNavigate()

  const [mobileNavLinksVisible, setMobileNavLinksVisible] = useState(false)

  const [searchResultsVisible, setSearchResultsVisible] = useState(false)

  const {currentUser, logOut, userInfo} = useAuth()

  const [searchResults, setSearchResults] = useState([])

  return (
    <div className='font-poppins relative border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800'>
      <header className='flex items-center px-4 py-1'>
        {/* logo and name */}
        <div className='flex items-center gap-2 md:w-[248px]' onClick={() => navigate('/')}>
        <img src={redditIcon} className='w-10'></img>
        <h1 className='hidden md:block text-1xl font-semibold text-gray-700 dark:text-white'>!Reddit</h1>
        </div>
        {/* search bar */}
        <div className='flex mx-auto gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-2 outline-blue-500 hover:outline outline-1 rounded-md md:w-4/12 w-48 focus-within:outline'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:invert" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input onClick={() => setSearchResultsVisible(true) } onChange={(e) => {
            searchSubreddit(e.target.value, setSearchResults, setSearchResultsVisible)
          }} type='text' placeholder='Search !Reddit' className='bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none w-full'>
          </input>
        </div>
        {searchResultsVisible ? 
        <ul className='absolute top-12 bg bg-gray-50 dark:bg-gray-900 shadow-md dark:text-white md:w-4/12 w-screen left-1/2 transform -translate-x-1/2 z-10'>
        {searchResults.map((result) => {
          return <li onClick={() => {navigate(`/r/${result}`); setSearchResultsVisible(false)}} className='px-2 cursor-pointer py-4 hover:bg-gray-200 dark:hover:bg-gray-800'>r/{result}</li>
        })}
        </ul>
        : null}
        
        {/* sign up and login buttons */}
        <ul className='flex text-1xl gap-2'>
          {currentUser ? 
          <span className='hidden md:flex w-8 h-8 justify-center items-center rounded-full'>
            <button>
              <svg onClick={() => props.setCreateCommunityPopUp(true)} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 dark:text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
           </button>
          </span> 
          : <>
          <button 
            className='hidden md:block w-32 py-1 border-blue-500 font-bold border rounded-full text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm'
            onClick={()=> props.setLogInPopUp(true)}>Log In</button>
          <button 
            className='hidden md:block w-32 py-1 bg-blue-500 font-bold rounded-full text-white hover:bg-blue-400 text-sm'
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
            <h3 className='hidden md:flex items-center text-xs font-semibold w-32 text-start'>{userInfo.username}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>} 
        </ul>
      </header>
      {/* dropdown menu contents */}
      { mobileNavLinksVisible ? <MobileNavLinks currentUser={currentUser} userInfo={userInfo} setMobileNavLinksVisible={setMobileNavLinksVisible}
        setLogInPopUp={props.setLogInPopUp} logOut={logOut} setCreateCommunityPopUp={props.setCreateCommunityPopUp}
      /> : null}
      {/* full screen button for disabling dropdown if clicking outside of it */}
      { mobileNavLinksVisible ? <button onClick={() => setMobileNavLinksVisible(!mobileNavLinksVisible)} className='fixed top-0 right-0 bottom-0 left-0 h-full w-full cursor-default'></button> : null}
      { searchResultsVisible ? <button onClick={() => setSearchResultsVisible(!searchResultsVisible)} className='fixed opacity-50 bg-black top-12 right-0 bottom-0 left-0 h-full w-full cursor-default'></button> : null}
    </div>
  )
}

export default Navbar