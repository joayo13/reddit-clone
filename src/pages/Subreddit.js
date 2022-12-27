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
      : <div className='bg-neutral-200 dark:bg-[#030303] min-h-screen'>
            <div className='flex flex-col-reverse md:flex-row justify-center gap-4 text-neutral-800'>
                <ul className='flex flex-col gap-4 lg:w-[40rem] md:w-[30rem] md:mt-4'>
                    {currentUser ? <CreatePostCard userInfo={userInfo} id={id}/> : null}
                    <ListPosts subredditPostsData={subredditPostsData} id={id}/>
                </ul>
                <ul className='flex flex-col gap-4 lg:w-[20rem] md:w-[15rem] mt-4'>
                    <li className='flex py-4 px-4 flex-col bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 className='text-md dark:text-white font-semibold'>About Community</h2>
                        <div className='flex gap-2 items-center'>
                          <div className='w-16 h-16 rounded-full text-4xl flex items-center justify-center' style={{ backgroundColor: subredditMetaData.communityColor }}>
                            <p className='text-white'>r/</p>
                          </div>
                          <div className='flex flex-col w-48'>
                          <h1 className='text-2xl'>r/{subredditMetaData.title}</h1>
                          <p className='text-sm opacity-50'>Created by {subredditMetaData.admin} on {subredditMetaData.birthday}</p>
                          </div>
                        </div>
                        <p className='text-sm'>{subredditMetaData.aboutCommunity}</p>
                        <p className='font-semibold text-sm'>{subredditMetaData.joined} Members</p>
                        <button disabled={buttonLoading} onClick={() => !userHasJoined ? userJoinSubreddit(db, currentUser, subredditMetaData.title, setUserHasJoined, setButtonLoading) : userLeaveSubreddit(db, currentUser, subredditMetaData.title, setUserHasJoined, setButtonLoading)} className='py-1 w-72 mb-4 mx-auto bg-blue-500 font-bold rounded-full text-white hover:bg-blue-400 text-sm'>{`${userHasJoined ? 'Unfollow' : 'Follow'}`}</button>
                    </li>
                    <li className='flex flex-col px-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 className='text-xs dark:text-white font-semibold'>R/{subredditMetaData.title.toUpperCase()} RULES</h2>
                        <ol className='flex flex-col gap-4'>
                        {subredditMetaData.subredditRules?.map((rule, index) => <li className='text-sm font-bold' key={index}>{index + 1}. {rule}</li>)}
                        </ol>
                    </li>
                </ul>
            </div>
        </div>}
        </>
  )
}

export default Subreddit
