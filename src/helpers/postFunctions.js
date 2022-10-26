import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase'
export async function deletePost(post, user) {
    try {
        if(user.username !== post.author) return 
        await deleteDoc(doc(db, 'subreddits', post.subredditId, 'posts', post.id))
    }
    catch(e) {
        console.log(e)
    }
}