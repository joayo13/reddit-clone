import React from 'react'
import redditIcon from '../images/reddit-icon.png'

function Subreddit() {
  return (
    <div>
        <section className='flex flex-col items-center md:flex-row md:justify-center mt-20 border border-black gap-4'>
            <img src={redditIcon} className='w-20 h-20 rounded-full border border-slate-200'></img>
            <h1 className='font-bold text-3xl'>Example Subreddit</h1>
            <button className=' border border-slate-800 text-slate-800 w-24 py-1 rounded-full'>Join</button>
        </section>
    </div>
  )
}

export default Subreddit