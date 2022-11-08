
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomePostCard from '../components/HomePostCard'
import LoadingWheel from '../components/LoadingWheel'
import { useAuth } from '../contexts/AuthContext'
import { getHomePagePosts} from '../helpers/getSubredditDataFunctions'
import { getTopSubreddits } from '../helpers/getTopSubreddits'
import bannerImage from '../images/banner-background.png'

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
                  <li className='flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-md pb-4'>
                    <div className='relative rounded-t-md overflow-hidden'>
                      <img src={bannerImage}></img>
                      <div className='absolute shadow-[inset_0_-35px_20px_-5px_rgba(0,0,0,0.4)] bottom-0 right-0 top-0 left-0'></div>
                      <h2 className='text-lg font-semibold text-white absolute bottom-2 left-4'>Top Communities</h2>
                    </div>
                      {topSubreddits.map((subreddit) => <div className='px-4 flex w-full items-center justify-between'><div><p>r/{subreddit.title}</p>
                      <span className='font-bold text-xs'>{subreddit.joined} Members</span>
                      </div>
                      <button 
                      className='w-16 bg-blue-500 h-6 font-bold rounded-full text-white hover:bg-blue-400 text-sm'
                      >Join</button>
                    </div>)}
                  </li>
                  <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-md'>
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