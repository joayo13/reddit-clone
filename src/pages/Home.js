
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomePostCard from '../components/HomePostCard'
import LoadingWheel from '../components/LoadingWheel'
import { useAuth } from '../contexts/AuthContext'
import { getHomePagePosts} from '../helpers/getSubredditDataFunctions'
import { getTopSubreddits } from '../helpers/getTopSubreddits'

function Home() {
  const {currentUser} = useAuth()
  const [homepagePostsData, setHomepagePostsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [topSubreddits, setTopSubreddits] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function getHomepage() {
      try {
        await getHomePagePosts(currentUser, setHomepagePostsData, setLoading)
        await getTopSubreddits(setTopSubreddits)
      }
      catch (e) {
        console.log(e)
      }
      finally {
        setLoading(false)
      }
    }
    getHomepage()
  },[currentUser])
  return (
    <>{loading ? <LoadingWheel/> :
      <div className='bg-gray-100 dark:bg-black min-h-screen'>
          <div className='flex flex-col-reverse md:flex-row justify-center pt-4 gap-4'>
              <ul className='flex flex-col gap-4 lg:w-[40rem] md:w-[30rem]'>
              <div className='flex flex-col gap-4'>{homepagePostsData.map((post, index) => 
            <HomePostCard key={index} post={post} index={index}/>
          )}</div>
              </ul>
              <ul className='flex flex-col gap-4 lg:w-[20rem] md:w-[15rem]'>
                  <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                      <h2 className='text-xl font-semibold'>Top Communities</h2>
                      {topSubreddits.map((subreddit) => <div className='cursor-pointer' onClick={() => navigate(`/r/${subreddit.title}`)}><p>r/{subreddit.title}</p>
                      <span className='font-bold text-xs'>{subreddit.joined} Members</span></div>)}
                  </li>
                  <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                      <h2 className='text-xl font-semibold'>Popular Communities</h2>
                      <ul className='flex flex-col gap-4'>
                      <p>r/Minions</p>
                      <p>r/Minions</p>
                      <p>r/Minions</p>
                      <p>r/Minions</p>
                      <p>r/Minions</p>
                      </ul>
                  </li>
              </ul>
          </div>
      </div>}
      </>
  )
}

export default Home