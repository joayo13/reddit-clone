import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
export async function userJoinSubreddit(db, currentUser, subreddit) {
    await updateDoc(doc(db, 'users', currentUser.email), {
        joinedSubreddits: arrayUnion(subreddit)
    })
}