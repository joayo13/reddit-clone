import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase'
export async function deletePost(post, user, setError) {
    try {
        if(user.username !== post.author) {
            setError('Only the author of this post can delete or edit it.')
            return
        }
        await deleteDoc(doc(db, 'subreddits', post.subredditId, 'posts', post.id))
    }
    catch(e) {
        console.log(e)
    }
}