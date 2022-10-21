import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
export async function userJoinSubreddit(db, currentUser, subreddit, setUserHasJoined) {
    await updateDoc(doc(db, 'users', currentUser.email), {
        joinedSubreddits: arrayUnion(subreddit)
    })
    setUserHasJoined(true)
}
export async function userLeaveSubreddit(db, currentUser, subreddit, setUserHasJoined) {
    await updateDoc(doc(db, 'users', currentUser.email), {
        joinedSubreddits: arrayRemove(subreddit)
    })
    setUserHasJoined(false)
}