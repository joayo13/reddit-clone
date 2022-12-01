/* eslint-disable no-unsafe-finally */
import { arrayRemove, arrayUnion, doc, getDoc, increment, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function getUsersUpvotedPostIdsArray (currentUser) {
  let postIdsArray = []
  try {
    const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
    if (docSnap.exists()) {
      postIdsArray = docSnap.data().upvotedPosts
    }
    return postIdsArray
  } catch (e) {
    console.log(e)
  }
}
export async function getUsersDownvotedPostIdsArray (currentUser) {
  let postIdsArray = []
  try {
    const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
    if (docSnap.exists()) {
      postIdsArray = docSnap.data().downvotedPosts
    }
    return postIdsArray
  } catch (e) {
    console.log(e)
  }
}
export async function getUsersUpvotedCommentIdsArray (currentUser) {
  let commentIdsArray = []
  try {
    const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
    if (docSnap.exists()) {
      commentIdsArray = docSnap.data().upvotedComments
    }
    return commentIdsArray
  } catch (e) {
    console.log(e)
  }
}
export async function getUsersDownvotedCommentIdsArray (currentUser) {
  let commentIdsArray = []
  try {
    const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
    if (docSnap.exists()) {
      commentIdsArray = docSnap.data().downvotedComments
    }
    return commentIdsArray
  } catch (e) {
    console.log(e)
  }
}
export async function checkIfCurrentPostInUsersUpvotedPostIdsArray (post, userUpvotedPostIdsArray) {
  if (userUpvotedPostIdsArray.includes(post.id)) {
    return true
  }
}
export async function checkIfCurrentPostInUsersDownvotedPostIdsArray (post, userDownvotedPostIdsArray) {
  if (userDownvotedPostIdsArray.includes(post.id)) {
    return true
  }
}
export function determineUpvoteCountElementColor (isUpvotedByUser, isDownvotedByUser) {
  if (isUpvotedByUser) {
    return '#ff4500'
  }
  if (isDownvotedByUser) {
    return '#7193ff'
  }
  return '#424444'
}
export async function upvotePost (setLoading, post, id, currentUser) {
  setLoading(true)
  let voteAmount = 1
  if (await checkIfCurrentPostInUsersUpvotedPostIdsArray(post, await getUsersUpvotedPostIdsArray(currentUser)) === true) {
    // handling unvoting without downvoting
    try {
      await updateDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'), {
        upvotes: increment(-1)
      })
      await updateDoc(doc(db, 'users', currentUser.uid), {
        upvotedPosts: arrayRemove(post.id)
      })
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
      return
    }
  }
  if (await checkIfCurrentPostInUsersDownvotedPostIdsArray(post, await getUsersDownvotedPostIdsArray(currentUser)) === true) {
    voteAmount = 2 // if user is currently downvoting the upvote is worth 2 since there has to be an unlike state in between
  }
  try {
    await updateDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'), {
      upvotes: increment(voteAmount)
    })
    await updateDoc(doc(db, 'users', currentUser.uid), {
      downvotedPosts: arrayRemove(post.id)
    })
    await updateDoc(doc(db, 'users', currentUser.uid), {
      upvotedPosts: arrayUnion(post.id)
    })
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
    return
  }
}
export async function downvotePost (setLoading, post, id, currentUser) {
  setLoading(true)
  let voteAmount = -1 // if user is currently upvoting the downvote is worth 2 since there has to be an unlike state in between
  if (await checkIfCurrentPostInUsersDownvotedPostIdsArray(post, await getUsersDownvotedPostIdsArray(currentUser)) === true) {
    // handling unvoting without upvoting
    try {
      await updateDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'), {
        upvotes: increment(1)
      })
      await updateDoc(doc(db, 'users', currentUser.uid), {
        downvotedPosts: arrayRemove(post.id)
      })
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
      return
    }
  }
  if (await checkIfCurrentPostInUsersUpvotedPostIdsArray(post, await getUsersUpvotedPostIdsArray(currentUser)) === true) {
    voteAmount = -2
  }
  try {
    await updateDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'), {
      upvotes: increment(voteAmount)
    })
    await updateDoc(doc(db, 'users', currentUser.uid), {
      upvotedPosts: arrayRemove(post.id)
    })
    await updateDoc(doc(db, 'users', currentUser.uid), {
      downvotedPosts: arrayUnion(post.id)
    })
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
    return
  }
}
export async function getPostUpvotes (post, setUpvotes) {
  try {
    const docSnap = await getDoc(doc(db, 'subreddits', post.subredditId, 'posts', post.id, 'feelings', 'upvotes'))
    if (docSnap.exists()) {
      setUpvotes(docSnap.data().upvotes)
    }
  } catch (e) {
    console.log(e)
  }
}
export async function displayUpvotedOrDownvoted (post, currentUser, setIsUpvotedByUser, setIsDownvotedByUser) {
  if (await checkIfCurrentPostInUsersUpvotedPostIdsArray(post, await getUsersUpvotedPostIdsArray(currentUser)) === true) {
    setIsUpvotedByUser(true)
    setIsDownvotedByUser(false)
    return
  }
  if (await checkIfCurrentPostInUsersDownvotedPostIdsArray(post, await getUsersDownvotedPostIdsArray(currentUser)) === true) {
    setIsDownvotedByUser(true)
    setIsUpvotedByUser(false)
    return
  }
  setIsDownvotedByUser(false)
  setIsUpvotedByUser(false)
}
