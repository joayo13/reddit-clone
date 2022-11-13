/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react'
import sideImage from '../images/login-signup-image.png'
import images from '../images/profilePictures/allPictures'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

function CreateUser (props) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const usernameRef = useRef()
  const [profilePicture, setProfilePicture] = useState(null)

  async function handleSubmit (e) {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await props.signUp(props.emailRef, props.passwordRef)
      try {
        await setDoc(doc(db, 'users', props.emailRef), {
          profilePicture: profilePicture,
          username: usernameRef.current.value,
          upvotedPosts: [],
          downvotedPosts: [],
          upvotedComments: [],
          downvotedComments: [],
          joinedSubreddits: [],
          createdPosts: []
        })
        props.setSignUpPopUp(false)
      } catch (e) {
        props.setError(`${e}`)
      }
    } catch (e) {
      props.setCreateUser(false)
      props.setError(`${e.message}`)
    }
    setLoading(false)
  }
  return (
    <div className='fixed flex w-screen h-screen justify-center items-center top-0 overflow-y-hidden z-10'>
      <div className='fixed w-screen h-screen left-0 top-0 right-0 bottom-0 bg-black opacity-50'></div>
      <div className='relative w-screen h-screen md:absolute md:w-[50rem] md:h-[40rem] dark:text-white rounded-md shadow-xl overflow-hidden'>
        <img src={sideImage} className='hidden md:block absolute top-0 left-0 h-full invert' alt='planet'></img>
        <div className='relative md:left-28 md:w-[43rem] w-full h-full dark:bg-gray-900 bg-white py-16 px-8 overflow-y-scroll'>
        <svg onClick={() => props.setSignUpPopUp(false)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute right-2 top-2 opacity-50" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <h1 className='font-medium text-lg text-center md:text-start'>Create your profile</h1>
        <p className='text-xs mt-2 md:w-1/3 text-center md:text-start'>Select a profile picture:</p>
        <ul className='w-80 flex flex-wrap gap-3 mt-4 justify-center md:justify-start mx-auto md:mx-0'>
            {images.map((image, index) => <li key={index}><img className={profilePicture !== image ? 'w-12 rounded-full' : 'w-12 rounded-full border-4 border-blue-500'} key={index} src={image} onClick={(e) => { setProfilePicture(e.target.src) }}></img></li>)}
        </ul>
        {error && <div className='w-full bg-red-400 p-4 font-semibold rounded-md mt-4'>{error}</div>}
        <form onSubmit={handleSubmit} className='mt-4 flex flex-col gap-6'>
        <p className='text-xs mt-2 md:w-1/3 text-center md:text-start'>Create a Username</p>
        <input maxLength={15} minLength={4} placeholder='USERNAME' type='text' ref={usernameRef} className='bg-gray-100 dark:bg-gray-800 py-4 indent-4 w-80 focus:outline-none'></input>
          <button disabled={loading} type='submit' className=' bg-blue-500 py-2 rounded-full text-white w-80 font-semibold mx-auto md:mx-0 hover:bg-blue-400'>Create Account</button>
        </form>
        </div>
      </div>
    </div>
  )
}

export default CreateUser
