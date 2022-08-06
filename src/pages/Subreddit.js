import React from 'react'
import redditIcon from '../images/reddit-icon.png'
import { useAuth } from '../contexts/AuthContext'

function Subreddit(props) {

    const {currentUser, logOut, setUserInfo, userInfo} = useAuth()

  return (
    <div className='bg-slate-100 dark:bg-black min-h-screen'>
        <section className='flex flex-col items-center md:flex-row md:justify-center gap-4 bg-white dark:bg-slate-900 dark:text-white py-2'>
            <img src={redditIcon} className='w-20 h-20 rounded-full border border-slate-200 dark:border-slate-800'></img>
            <h1 className='font-bold text-3xl text-center'>Example Subreddit</h1>
            <button className=' border border-slate-800 text-slate-800 w-24 py-1 rounded-full dark:text-white dark:border-white'>Join</button>
        </section>
        <div className='flex flex-col-reverse md:flex-row justify-center mt-10 gap-4'>
            <ul className='flex flex-col gap-4 lg:w-[40rem] md:w-[30rem]'>
                {currentUser ? 
                <li className='flex gap-2 px-4 py-4 bg-white dark:bg-slate-900 dark:border-slate-800 border border-slate-200 rounded-md'>
                    <img src={userInfo.profilePicture} className='w-10 rounded-full'></img>
                    <input type='text' placeholder='Create Post' className='w-full outline-none bg-slate-100 dark:bg-slate-800 dark:text-white indent-2 rounded-md'></input>
                </li> : null}
                <li className='flex flex-col gap-2 px-4 py-4 bg-white border border-slate-200 rounded-md dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'>
                    <p className='text-xs text-slate-500'>Posted by u/Admin 1 day ago</p>
                    <h1>Which job is definitely overpayed?</h1>
                    <ul className='flex gap-2'>
                        <li className='flex gap-2 font-semibold'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                            </svg>
                            0
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                            </svg>
                        </li>
                        <li className='flex gap-2 opacity-50'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        242 Comments
                        </li>
                    </ul>
                </li>
            </ul>
            <span className='flex md:hidden w-screen h-px bg-white items-center text-white justify-center'><p className='bg-black px-2'>Posts</p></span>
            <ul className='flex flex-col gap-4 lg:w-[20rem] md:w-[15rem]'>
                <li className='flex flex-col px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-slate-300 gap-4 rounded-md'>
                    <h2 className='text-xl font-semibold'>About Community</h2>
                    <p>r/Example is the place to do all your testing</p>
                    <p className='font-semibold'>0 members</p>
                </li>
                <li className='flex flex-col px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-slate-300 gap-4 rounded-md'>
                    <h2 className='text-xl font-semibold'>Subreddit Rules</h2>
                    <ol className='flex flex-col px-4 gap-4 list-decimal'>
                    <li>No hacking me</li>
                    <li>No bad memes</li>
                    <li>Fuck off</li>
                    </ol>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Subreddit