/* eslint-disable no-useless-catch */
import { doc, getDoc, getDocs, setDoc, serverTimestamp, collection } from 'firebase/firestore'
import uniqid from 'uniqid'
import { db } from '../firebase'

export async function createPost (id, postTitleRef, userInfo, postTextRef, navigate, imageURL, url, setError) {
  if (!postTitleRef.current.value) {
    setError('A post title is required to create a post.')
    return
  }
  const uniqueId = uniqid()
  try {
    await setDoc(doc(db, 'subreddits', id, 'posts', uniqueId), {
      postTitle: postTitleRef.current.value,
      author: userInfo.username,
      timestamp: serverTimestamp(),
      text: postTextRef.current.value,
      id: uniqueId,
      subredditId: id,
      imageURL,
      url
    })
    await setDoc(doc(db, 'subreddits', id, 'posts', uniqueId, 'feelings', 'upvotes'), {
      upvotes: 0
    })
    navigate(`/r/${id}/comments/${uniqueId}`)
  } catch (e) {
    console.log(e)
  }
}

export async function fetchSubredditData (setSubredditMetaData, setLoading, id) {
  try {
    const docSnap = await getDoc(doc(db, 'subreddits', id))
    if (docSnap.exists()) {
      setSubredditMetaData(docSnap.data())
      setLoading(false)
    } else {
      setLoading(false)
    }
  } catch (e) {
    console.log(e)
  }
}
export async function fetchSubredditPosts (setSubredditPostsData, setLoading, id) {
  const data = []
  try {
    const querySnapshot = await getDocs(collection(db, 'subreddits', id, 'posts'))
    querySnapshot.forEach(async (post, index) => {
      if (post.data().postTitle !== '') {
        data.push({ ...post.data() })
        console.log(post.data())
      }
    })
    setSubredditPostsData(data)
    setLoading(false)
  } catch (e) {
    console.log(e)
  }
}

export async function getHomePagePosts (currentUser, setHomepagePostsData, setLoading, setUserJoinedSubreddits, isNotSignedUp) {
  let joinedSubredditsArray = []
  const popularPosts = []
  async function getUsersJoinedSubredditsArray (currentUser) {
    try {
      if (isNotSignedUp === true) {
        joinedSubredditsArray = ['fasd']
      }
      if (!isNotSignedUp) {
        const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
        joinedSubredditsArray = docSnap.data().joinedSubreddits
        setUserJoinedSubreddits(docSnap.data().joinedSubreddits)
      }
    } catch (e) {
      throw (e)
    }
  }
  async function getPostsFromJoinedSubreddits (joinedSubredditsArray) {
    joinedSubredditsArray.forEach(async (subreddit, index) => {
      try {
        const querySnapshot = await getDocs(collection(db, 'subreddits', subreddit, 'posts'))
        querySnapshot.forEach((post) => {
          if (post.data().postTitle !== '') {
            popularPosts.push(post.data())
          }
        })
      } catch (e) {
        console.log(e)
      } finally {
        if (index === joinedSubredditsArray.length - 1) {
          setHomepagePostsData(randomizePosts(popularPosts))
        }
      }
    })
  }

  function randomizePosts (array) {
    // eslint-disable-next-line one-var
    let currentIndex = array.length, randomIndex

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }
    return array
  }

  try {
    await getUsersJoinedSubredditsArray(currentUser)
    try {
      await getPostsFromJoinedSubreddits(joinedSubredditsArray)
    } catch (e) {
      console.log(e)
    }
  } catch (e) {
    throw (e)
  }
}
