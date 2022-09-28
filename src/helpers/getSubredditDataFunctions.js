import { doc, getDoc, getDocs, setDoc, serverTimestamp, collection} from "firebase/firestore";
import uniqid from 'uniqid'
import { db } from '../firebase'

export async function createPost( id, postTitleRef, userInfo, postTextRef, navigate) {
    const uniqueId = uniqid()
    try {
        await setDoc(doc(db, "subreddits", id, "posts", uniqueId), {
            postTitle: postTitleRef.current.value,
            author: userInfo.username,
            timestamp: serverTimestamp(),
            text: postTextRef.current.value,
            id: uniqueId
        })
        await setDoc(doc(db, 'subreddits', id, "posts", uniqueId, 'feelings', 'upvotes'), {
            upvotes: 0,
        })
        navigate(`/r/${id}/comments/${uniqueId}`)
    }
    catch(e) {
        console.log(e)
    }
}

export async function fetchSubredditData(setSubredditMetaData, setLoading, id) {
    try {
        const docSnap = await getDoc(doc(db, 'subreddits', id))
        if(docSnap.exists()) {
            setSubredditMetaData(docSnap.data())
            setLoading(false)
        }
    }
    catch(e) {
        console.log(e)
    }
}
export async function fetchSubredditPosts(setSubredditPostsData, setLoading, id) {
    let data = []
    try {
        const querySnapshot = await getDocs(collection(db, 'subreddits', id, 'posts'))
        querySnapshot.forEach( async (post) => {
            data.push({...post.data()})    
        })   
        if(data.length === querySnapshot.size) {
            setSubredditPostsData(data)
            setLoading(false)
        }
    }    
    catch(e) {
        console.log(e)
    }
}
export async function getUsersJoinedSubreddits(currentUser) {
    const docSnap = await getDoc(doc(db, 'users', currentUser.email))
    let subredditsPopularPostsData = []
    if(docSnap.exists()) {
      docSnap.data().joinedSubreddits.forEach( async (subreddit) => {
        const querySnapshot = await getDocs(collection(db, 'subreddits', subreddit, 'posts'))
        querySnapshot.forEach( async (post) => {
          const upvotes = await getDoc(doc(db, 'subreddits', subreddit, 'posts', post.id, 'feelings', 'upvotes'))
          subredditsPopularPostsData.push({...post.data(), subredditId: subreddit, upvotes: upvotes.data().upvotes})
        })
      }) 
      return subredditsPopularPostsData
    }
  }