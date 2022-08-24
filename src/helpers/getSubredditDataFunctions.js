import { doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";
import uniqid from 'uniqid'
import { db } from '../firebase'

export async function createPost( id, postTitleRef, userInfo, postTextRef, navigate) {
    const uniqueId = uniqid()
    try {
        await setDoc(doc(db, "subreddits", id, "posts", uniqueId), {
            postTitle: postTitleRef.current.value,
            author: userInfo.username,
            timestamp: serverTimestamp(),
            text: postTextRef.current.value,
            id: uniqueId
        })
        await setDoc(doc(db, 'subreddits', id, "posts", uniqueId, 'feelings', 'upvotes'), {
            upvotes: 0,
        })
        navigate(`/r/${id}/comments/${uniqueId}`)
    }
    catch(e) {
        console.log(e)
    }
}

export async function fetchSubredditData(setSubredditMetaData, setLoading, id) {
    try {
        const docSnap = await getDoc(doc(db, 'subreddits', id))
        if(docSnap.exists()) {
            setSubredditMetaData(docSnap.data())
            setLoading(false)
        }
    }
    catch(e) {
        console.log(e)
    }
}