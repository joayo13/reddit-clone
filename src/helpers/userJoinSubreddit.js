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
export async function userJoinSubredditFromHome(db, currentUser, subreddit, setUsersJoinedSubreddits) {
    await updateDoc(doc(db, 'users', currentUser.email), {
        joinedSubreddits: arrayUnion(subreddit)
    })
    await updateDoc(doc(db, 'subreddits', subreddit), {
        joined: increment(1)
    })
    setUsersJoinedSubreddits(prev => prev.concat(subreddit))
}
export async function userLeaveSubredditFromHome(db, currentUser, subreddit, setUsersJoinedSubreddits) {
    await updateDoc(doc(db, 'users', currentUser.email), {
        joinedSubreddits: arrayRemove(subreddit)
    })
    await updateDoc(doc(db, 'subreddits', subreddit), {
        joined: increment(-1)
    })
    setUsersJoinedSubreddits(prev => prev.filter(() => subreddit === prev))
}