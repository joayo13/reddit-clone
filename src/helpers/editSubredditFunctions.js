import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function changeCommunityProfilePicture (subreddit, URL) {
  try {
    await updateDoc(doc(db, 'subreddits', subreddit.title), {
      communityDisplayPictureURL: URL
    })
  } catch (e) {
    console.log(e)
  }
}
