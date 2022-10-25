import { arrayRemove, arrayUnion, doc, increment, updateDoc } from 'firebase/firestore'
export async function userJoinSubreddit(db, currentUser, subreddit, setUserHasJoined) {
    await updateDoc(doc(db, 'users', currentUser.email), {
        joinedSubreddits: arrayUnion(subreddit)
    })
    await updateDoc(doc(db, 'subreddits', subreddit), {
        joined: increment(1)
    })
    setUserHasJoined(true)
}
export async function userLeaveSubreddit(db, currentUser, subreddit, setUserHasJoined) {
    await updateDoc(doc(db, 'users', currentUser.email), {
        joinedSubreddits: arrayRemove(subreddit)
    })
    await updateDoc(doc(db, 'subreddits', subreddit), {
        joined: increment(-1)
    })
    setUserHasJoined(false)
}