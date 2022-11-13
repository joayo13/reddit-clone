import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase'

export async function getTopSubreddits (setTopSubreddits) {
  const topSubreddits = []
  try {
    const querySnapshot = await getDocs(collection(db, 'subreddits'))
    querySnapshot.forEach((subreddit) => {
      topSubreddits.push(subreddit.data())
    })
  } catch (e) {
    console.log(e)
  } finally {
    setTopSubreddits(topSubreddits.sort((a, b) => b.joined - a.joined))
  }
}
