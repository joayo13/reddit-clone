import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export async function searchSubreddit (chars, setSearchResults, setSearchResultsVisible) {
  if (!chars) {
    setSearchResults([])
    return
  }
  const matchedSubreddits = []
  try {
    const querySnapshot = await getDocs(collection(db, 'subreddits'))
    querySnapshot.forEach((post) => {
      if (post.data().title.includes(chars)) {
        matchedSubreddits.push(post.data())
      }
    })
  } catch (e) {
    console.log(e)
  } finally {
    setSearchResults(matchedSubreddits)
    setSearchResultsVisible(true)
  }
}
