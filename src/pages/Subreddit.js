import { React, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import ListPosts from '../components/ListPosts'
import CreatePostCard from '../components/CreatePostCard'
import { userJoinSubreddit, userLeaveSubreddit } from '../helpers/userJoinSubreddit'
import { fetchSubredditData, fetchSubredditPosts } from '../helpers/getSubredditDataFunctions'
import { doc, getDoc } from 'firebase/firestore'
import LoadingWheel from '../components/LoadingWheel'

function Subreddit (props) {
  const { currentUser, userInfo } = useAuth()
  const [subredditPostsData, setSubredditPostsData] = useState([])
  const [subredditMetaData, setSubredditMetaData] = useState({})
  const [loading, setLoading] = useState(true)
  const [userHasJoined, setUserHasJoined] = useState(false)
  const { id } = useParams()
  const [buttonLoading, setButtonLoading] = useState(false)
  useEffect(() => {
    fetchSubredditData(setSubredditMetaData, setLoading, id)
    fetchSubredditPosts(setSubredditPostsData, setLoading, id)
  }, [id])
  useEffect(() => {
    async function checkIfUserHasJoined () {
      if (userHasJoined) return
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
      if (docSnap.data().joinedSubreddits.includes(subredditMetaData.title)) {
        setUserHasJoined(true)
      }
    }
    checkIfUserHasJoined()
  })

  return (
    <>{ loading
      ? <LoadingWheel/>
      : <div className='bg-gray-200 dark:bg-black min-h-screen'>
            <div className='flex flex-col-reverse md:flex-row justify-center gap-4'>
                <ul className='flex flex-col gap-4 lg:w-[40rem] md:w-[30rem] mt-4'>
                    {currentUser ? <CreatePostCard userInfo={userInfo} id={id}/> : null}
                    <ListPosts subredditPostsData={subredditPostsData} id={id}/>
                </ul>
                <ul className='flex flex-col md:gap-4 lg:w-[20rem] md:w-[15rem] mt-4'>
                    <li className='flex flex-col bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 dark:text-gray-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 style={{ backgroundColor: subredditMetaData.communityColor }} className='px-4 py-2 text-md text-white font-semibold'>About Community</h2>
                        <p className='px-4 text-sm'>{subredditMetaData.aboutCommunity}</p>
                        <div className='flex gap-4 items-center h-8 px-4'>
                        <p className='font-semibold text-sm'>{subredditMetaData.joined} Members</p>
                        <button disabled={buttonLoading} onClick={() => !userHasJoined ? userJoinSubreddit(db, currentUser, subredditMetaData.title, setUserHasJoined, setButtonLoading) : userLeaveSubreddit(db, currentUser, subredditMetaData.title, setUserHasJoined, setButtonLoading)} className='px-2 bg-blue-500 font-bold rounded-full text-white hover:bg-blue-400 text-sm'>{`${userHasJoined ? 'Unfollow' : 'Follow'}`}</button>
                        </div>
                    </li>
                    <li className='flex flex-col bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 dark:text-gray-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 style={{ backgroundColor: subredditMetaData.communityColor }} className='px-4 py-2 text-xs text-white font-semibold'>R/{subredditMetaData.title.toUpperCase()} RULES</h2>
                        <ol className='flex flex-col gap-4 list-decimal pb-4'>
                        {subredditMetaData.subredditRules?.map((rule, index) => <li className='px-4 text-sm font-bold' key={index}>{index + 1}. {rule}</li>)}
                        </ol>
                    </li>
                </ul>
            </div>
        </div>}
        </>
  )
}

export default Subreddit
