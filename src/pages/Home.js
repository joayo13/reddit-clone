
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomePostCard from '../components/HomePostCard'
import LoadingWheel from '../components/LoadingWheel'
import { useAuth } from '../contexts/AuthContext'
import { getHomePagePosts} from '../helpers/getSubredditDataFunctions'
import { getTopSubreddits } from '../helpers/getTopSubreddits'
import bannerImage from '../images/banner-background.png'
import bannerImage2 from '../images/yourCommunitiesPhoto.jpg'

function Home() {
  const {currentUser} = useAuth()
  const [homepagePostsData, setHomepagePostsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [topSubreddits, setTopSubreddits] = useState([])
  const [userJoinedSubreddits, setUserJoinedSubreddits] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function getHomepage() {
      try {
        await getHomePagePosts(currentUser, setHomepagePostsData, setLoading, setUserJoinedSubreddits)
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
                      {topSubreddits.map((subreddit) => 
                      <div className='px-4 relative w-full'>
                        <div className='absolute left-4 bottom-1/2 translate-y-1/2 flex items-center gap-2'>
                        <p className='font-bold text-sm'>{topSubreddits.indexOf(subreddit) + 1}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="#46d160" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>

                        </div>
                        <div className='ml-12'>
                          <p>r/{subreddit.title}</p>
                          <span className='font-bold text-xs'>{subreddit.joined} Members</span>
                        </div>
                      {userJoinedSubreddits.includes(subreddit.title) ? <button className='absolute right-4 bottom-1/2 translate-y-1/2 w-20 bg-blue-500 h-6 font-bold rounded-full text-white hover:bg-blue-400 text-sm'>Unfollow</button>
                      : <button className='absolute right-4 bottom-1/2 translate-y-1/2 w-20 bg-blue-500 h-6 font-bold rounded-full text-white hover:bg-blue-400 text-sm'>Follow</button>}
                      </div>)}
                  </li>
                  <li className='flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-md pb-4'>
                  <div className='relative rounded-t-md overflow-hidden h-24'>
                      <img src={bannerImage2}></img>
                      <div className='absolute shadow-[inset_0_-35px_20px_-5px_rgba(0,0,0,0.4)] bottom-0 right-0 top-0 left-0'></div>
                      <h2 className='text-lg font-semibold text-white absolute bottom-2 left-4'>Your Communities</h2>
                    </div>
                      <ul className='flex px-4 flex-col gap-4'>
                      {userJoinedSubreddits.map((subreddit) => <p className='font-bold cursor-pointer' onClick={() => navigate(`/r/${subreddit}`)}>r/{subreddit}</p>)}
                      </ul>
                  </li>
              </ul>
          </div>
      </div>}
      </>
  )
}

export default Home