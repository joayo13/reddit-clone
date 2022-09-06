import { getDoc, doc, getDocs, collection } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

function Home() {
  const {currentUser, userInfo} = useAuth()

  useEffect(() => {
    if (!currentUser) return 
    async function getUsersJoinedSubreddits() {
      const docSnap = await getDoc(doc(db, 'users', currentUser.email))
      if(docSnap.exists()) {
        let subredditsPopularPostsData = []
        docSnap.data().joinedSubreddits.forEach( async (subreddit) => {
          //get top 5 posts of each joined subreddit if currentuser
          const querySnapshot = await getDocs(collection(db, 'subreddits', subreddit, 'posts'))
          querySnapshot.forEach((post) => {
            subredditsPopularPostsData.push({...post.data()})
          })
          console.log(subredditsPopularPostsData)
        })
        
      }
    }
    getUsersJoinedSubreddits()
  },[currentUser])
  return (
    <div>

    </div>
  )
}

export default Home