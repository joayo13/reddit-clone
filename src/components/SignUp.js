import React, { useRef, useState } from 'react'
import sideImage from '../images/login-signup-image.png'
import { useAuth } from '../contexts/AuthContext'

function SignUp(props) {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const {signUp} = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit (e) {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }
    try {
      setError('')
      setLoading(true)
      await signUp(emailRef.current.value, passwordRef.current.value)
    }
    catch {
      setError('Failed to create an account')
    }
    setLoading(false)
  }
  return (
      <div className='fixed flex w-screen h-screen justify-center items-center top-0 overflow-y-hidden'>
      <div className='fixed w-screen h-screen left-0 top-0 right-0 bottom-0 bg-black opacity-50'></div>
      <div className='relative w-screen h-screen md:absolute md:w-[50rem] md:h-[40rem] bg-white rounded-md shadow-xl overflow-hidden'>
        <img src={sideImage} className='hidden md:block absolute top-0 left-0 h-full' alt='planet'></img>
        <div className='relative md:left-28 md:w-[43rem] w-full h-full bg-white py-16 px-8'>
        <svg onClick={()=> props.setSignUpPopUp(false)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute right-2 top-2 opacity-50" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <h1 className='font-medium text-lg'>Sign Up</h1>
        <p className='text-xs mt-2 md:w-1/3'>By continuing, you are setting up a Reddit account and you agree to our User Agreement and Privacy Policy.</p>
        {error && <div className='w-full bg-red-400'>{error}</div>}
        <form onSubmit={handleSubmit} className='mt-20 flex flex-col gap-6'>
          <input placeholder='EMAIL' ref={emailRef} type='email' className=' bg-slate-100 py-4 indent-4 w-80 focus:outline-none'></input>
          <input placeholder='PASSWORD' ref={passwordRef} type='password' className=' bg-slate-100 py-4 indent-4 w-80 focus:outline-none'></input>
          <input placeholder='CONFIRM PASSWORD' ref={passwordConfirmRef} type='password' className='bg-slate-100 py-4 indent-4 w-80 focus:outline-none'></input>
          <button disabled={loading} type='submit' className=' bg-teal-700 py-2 rounded-full text-white w-80 font-semibold mx-auto md:mx-0'>Continue</button>
        </form>
        <h2 className='text-sm mt-10'>Already a !Redditor? <button className='text-blue-500' onClick={() => {props.setSignUpPopUp(false); props.setLogInPopUp(true)}}>Log In</button></h2>
        </div>
      </div>
    </div>
  )
}

export default SignUp