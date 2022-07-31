import React from 'react'
import sideImage from '../images/login-signup-image.png'

function SignUp(props) {
  return (
      <div className='fixed flex w-screen h-screen justify-center items-center top-0 overflow-y-hidden'>
      <div className='fixed w-screen h-screen left-0 top-0 right-0 bottom-0 bg-black opacity-50'></div>
      <div className='relative w-screen h-screen md:absolute md:w-[50rem] md:h-[40rem] bg-white rounded-md shadow-xl'>
        <img src={sideImage} className='hidden md:block absolute top-0 left-0 h-full' alt='planet'></img>
        <div className='relative md:left-28 md:w-[43rem] w-full h-full bg-white py-16 px-8'>
        <svg onClick={()=> props.setSignUpPopUp(false)} xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 absolute right-2 top-2 opacity-50" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        <h1 className='font-medium text-lg'>Sign Up</h1>
        <p className='text-xs mt-2 md:w-1/3'>By continuing, you are setting up a Reddit account and you agree to our User Agreement and Privacy Policy.</p>
        <form className='mt-20 flex flex-col gap-6'>
          <input placeholder='EMAIL' type='email' className=' bg-slate-100 py-4 indent-4 w-80 focus:outline-none hover:text-xs transition-all ease-in-out duration-300'></input>
          <input placeholder='PASSWORD' type='password' className=' bg-slate-100 py-4 indent-4 w-80 focus:outline-none hover:text-xs transition-all ease-in-out duration-300'></input>
          <input placeholder='CONFIRM PASSWORD' type='password' className=' bg-slate-100 py-4 indent-4 w-80 focus:outline-none hover:text-xs transition-all ease-in-out duration-300'></input>
        </form>
        <h2 className='text-sm mt-10'>Already a !Redditor? <button className='text-blue-500' onClick={() => {props.setSignUpPopUp(false); props.setLogInPopUp(true)}}>Log In</button></h2>
        </div>
      </div>
    </div>
  )
}

export default SignUp