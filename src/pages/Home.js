/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomePostCard from '../components/HomePostCard'
import LoadingWheel from '../components/LoadingWheel'
import { useAuth } from '../contexts/AuthContext'
import { getHomePagePosts } from '../helpers/getSubredditDataFunctions'
import { getTopSubreddits } from '../helpers/getTopSubreddits'
import { userJoinSubredditFromHome, userLeaveSubredditFromHome } from '../helpers/userJoinSubreddit'
import CreatePostCard from '../components/CreatePostCard'
import bannerImage from '../images/banner-background.png'
import bannerImage2 from '../images/yourCommunitiesPhoto.jpg'
import { db } from '../firebase'

function Home (props) {
  const { currentUser, userInfo } = useAuth()
  const [homepagePostsData, setHomepagePostsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [topSubreddits, setTopSubreddits] = useState([])
  const [userJoinedSubreddits, setUserJoinedSubreddits] = useState([])
  const navigate = useNavigate()
  const [joinCommunityButtonLoading, setJoinCommunityButtonLoading] = useState(false)
  const defaultUser = {
    uid: 'FYTHeAA0osdRNlMoV4zaEulVVwD2'
  }

  useEffect(() => {
    async function getHomepage () {
      try {
        if (!currentUser) {
          await getHomePagePosts(defaultUser, setHomepagePostsData, setLoading, setUserJoinedSubreddits, true)
          await getTopSubreddits(setTopSubreddits)
        }
        await getHomePagePosts(currentUser, setHomepagePostsData, setLoading, setUserJoinedSubreddits)
        await getTopSubreddits(setTopSubreddits)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    getHomepage()
  }, [currentUser])

  return (
    <>{loading
      ? <LoadingWheel/>
      : <div className='bg-neutral-200 dark:bg-[#030303] min-h-screen'>
          <div className='flex flex-col-reverse md:flex-row text-neutral-800 justify-center pt-4 gap-4'>
              <ul className='flex-col gap-4 lg:w-[40rem] md:w-[30rem]'>
              <div className='flex flex-col gap-4'>
              {currentUser ? <CreatePostCard userInfo={ userInfo } id={'default'}/> : null}
                { homepagePostsData.map((post, index) =>
            <HomePostCard key={index} post={post} index={index}/>
                )}
              </div>
              </ul>
              <ul className='flex flex-col -mt-4 md:mt-0 gap-4 md:gap-4 lg:w-[20rem] md:w-[15rem]'>
                  <li className='flex flex-col bg-white dark:bg-neutral-900 md:border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 overflow-hidden md:rounded-md'>
                    <div className='relative md:h-20 h-12'>
                      <img className='object-cover h-full w-full' src={bannerImage}></img>
                      <div className='absolute shadow-[inset_0_-60px_50px_-20px_rgba(0,0,0,0.5)] bottom-0 right-0 top-0 left-0'></div>
                      <h2 className='text-lg font-medium text-white absolute bottom-2 left-4'>Top Communities</h2>
                    </div>
                      {topSubreddits.slice(0, 4).map((subreddit, index) =>
                      <div key={index} className='px-4 py-2 relative w-full border-t border-neutral-300 dark:border-neutral-800'>
                        <div className='absolute left-4 bottom-1/2 translate-y-1/2 flex items-center gap-2'>
                        <p className='font-medium text-sm'>{topSubreddits.indexOf(subreddit) + 1}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke="#46d160" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                        </div>
                        <div className='ml-12 flex md:block items-baseline gap-2'>
                          <p className='font-medium'>r/{subreddit.title}</p>
                          <span className='text-xs'>{subreddit.joined} Members</span>
                        </div>
                      {currentUser && userJoinedSubreddits.includes(subreddit.title)
                        ? <button disabled={joinCommunityButtonLoading} onClick={async () => await userLeaveSubredditFromHome(db, currentUser, subreddit.title, setUserJoinedSubreddits, setJoinCommunityButtonLoading)} className='absolute right-4 bottom-1/2 translate-y-1/2 w-20 bg-blue-500 h-6 font-bold rounded-full text-white hover:bg-blue-400 text-sm'>Unfollow</button>
                        : <button disabled={joinCommunityButtonLoading} onClick={async () => await userJoinSubredditFromHome(db, currentUser, subreddit.title, setUserJoinedSubreddits, setJoinCommunityButtonLoading)} className='absolute right-4 bottom-1/2 translate-y-1/2 w-20 bg-blue-500 h-6 font-bold rounded-full text-white hover:bg-blue-400 text-sm'>Follow</button>}
                      </div>)}
                  </li>
                  <li className='flex flex-col bg-white dark:bg-neutral-900 md:border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 md:rounded-md overflow-hidden'>
                  <div className='relative md:h-20 h-12'>
                      <img className='object-cover h-full w-full' src={bannerImage2}></img>
                      <div className='absolute shadow-[inset_0_-60px_50px_-20px_rgba(0,0,0,0.5)] bottom-0 right-0 top-0 left-0'></div>
                      <h2 className='text-lg font-medium text-white absolute bottom-2 left-4'>Your Communities</h2>
                    </div>
                      <ul className='flex flex-col'>
                      {currentUser && topSubreddits.filter((subreddit) => userJoinedSubreddits.includes(subreddit.title)).map((filteredSubreddit, index) =>
                       <div className='flex px-4 py-2 gap-2 items-center border-t border-neutral-300 dark:border-neutral-800' key={index}>
                        <div style={{ backgroundColor: filteredSubreddit.communityColor }} className='w-8 h-8 flex items-center justify-center text-white rounded-full font-medium'>r/</div>
                        <div className='flex md:flex-col gap-2 items-baseline'>
                       <li className='font-medium cursor-pointer' onClick={() => navigate(`/r/${filteredSubreddit.title}`)}>r/{filteredSubreddit.title}</li>
                       <p className='text-xs'>{filteredSubreddit.joined} Members</p>
                       </div>
                       </div>)}
                       {userJoinedSubreddits.length === 0 && currentUser ? <li className='text-sm px-2 py-4'>You haven&apos;t joined any communities yet. </li> : null}
                       {!currentUser ? <li className='text-sm px-2 py-4'><a className='text-blue-500 cursor-pointer' onClick={() => props.setSignUpPopUp(true)}>Sign Up</a> to start joining communities. </li> : null }
                      </ul>
                  </li>
              </ul>
          </div>
      </div>}
      </>
  )
}

export default Home
