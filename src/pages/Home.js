import { getDoc, doc, getDocs, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

function Home() {
  const {currentUser, userInfo} = useAuth()
  const [homepagePostsData, setHomepagePostsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return 
    
    async function getUsersJoinedSubreddits() {
      let subredditsPopularPostsData = []
      const docSnap = await getDoc(doc(db, 'users', currentUser.email))
      if(docSnap.exists()) {
        docSnap.data().joinedSubreddits.forEach( async (subreddit) => {
          const querySnapshot = await getDocs(collection(db, 'subreddits', subreddit, 'posts'))
          querySnapshot.forEach((post) => {
            subredditsPopularPostsData.push({...post.data(), subredditId: subreddit})
          })
          setHomepagePostsData(subredditsPopularPostsData.filter((item,index) => index < 5))
        })
      }
    }
    getUsersJoinedSubreddits()
    setLoading(false)
  },[currentUser])
  return (
    <>{loading ? null :
      <div className='bg-gray-100 dark:bg-black min-h-screen'>
          <div className='flex flex-col-reverse md:flex-row justify-center mt-4 gap-4'>
              <ul className='flex flex-col gap-4 lg:w-[40rem] md:w-[30rem]'>
              <div className='flex flex-col gap-4'>{homepagePostsData.map((post, index) => 
            <PostCard key={index} post={post} index={index} id={post.subredditId}/>
          )}</div>
              </ul>
              <ul className='flex flex-col gap-4 lg:w-[20rem] md:w-[15rem]'>
                  <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                      <h2 className='text-xl font-semibold'>About Community</h2>
                      <p></p>
                      <p className='font-semibold'>0 members</p>
                  </li>
                  <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                      <h2 className='text-xl font-semibold'>Subreddit Rules</h2>
                      <ol className='flex flex-col px-4 gap-4 list-decimal'>
                      </ol>
                  </li>
              </ul>
          </div>
      </div>}
      </>
  )
}

export default Home