import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
export async function deletePost (post, user, setError, subredditMetaData) {
  try {
    if (user.username !== post.author && subredditMetaData.admin !== user.username) {
      setError('Only the author of this post can delete it.')
      return
    }
    await deleteDoc(doc(db, 'subreddits', post.subredditId, 'posts', post.id))
    window.location.reload()
  } catch (e) {
    console.log(e)
  }
}
export async function editPost (post, user, setError, text) {
  try {
    await updateDoc(doc(db, 'subreddits', post.subredditId, 'posts', post.id), {
      text
    })
    window.location.reload()
  } catch (e) {
    console.log(e)
  }
}
