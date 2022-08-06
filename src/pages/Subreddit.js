import React from 'react'
import redditIcon from '../images/reddit-icon.png'

function Subreddit() {
  return (
    <div className='bg-slate-100'>
        <section className='flex flex-col items-center md:flex-row md:justify-center mt-20 border border-black gap-4 bg-white'>
            <img src={redditIcon} className='w-20 h-20 rounded-full border border-slate-200'></img>
            <h1 className='font-bold text-3xl'>Example Subreddit</h1>
            <button className=' border border-slate-800 text-slate-800 w-24 py-1 rounded-full'>Join</button>
        </section>
        <div className='flex justify-center mt-10 gap-4'>
            <ul className='flex flex-col gap-4 lg:w-[40rem] md:w-[30rem]'>
                <li className='px-4 py-4 bg-white border border-slate-200'>Post</li>
                <li className='px-4 py-4 bg-white border border-slate-200'>Post</li>
                <li className='px-4 py-4 bg-white border border-slate-200'>Post</li>
                <li className='px-4 py-4 bg-white border border-slate-200'>Post</li>
            </ul>
            <ul className='flex flex-col gap-4 lg:w-[20rem] md:w-[10rem]'>
                <li className='flex flex-col px-4 py-4 bg-white border border-slate-200 gap-4'>
                    <h2 className='text-xl font-semibold'>About Community</h2>
                    <p>r/Example is the place to do all your testing</p>
                    <p className='font-semibold'>0 members</p>
                </li>
                <li className='flex flex-col px-4 py-4 bg-white border border-slate-200 gap-4'>
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