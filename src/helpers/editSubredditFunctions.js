import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function changeCommunityProfilePicture (subreddit, URL, setChangesSaved) {
  if (!URL) {
    return
  }
  try {
    await updateDoc(doc(db, 'subreddits', subreddit.title), {
      communityDisplayPictureURL: URL
    })
    setChangesSaved(true)
  } catch (e) {
    console.log(e)
  }
}
