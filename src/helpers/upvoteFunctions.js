import { doc, getDoc} from "firebase/firestore";
import { db } from '../firebase'

export async function getUsersUpvotedPostIdsArray(currentUser) {
    let postIdsArray = []
    try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.email))
        if(docSnap.exists()) {
            postIdsArray = docSnap.data().upvotedPosts
        }
        return postIdsArray
    }
    catch(e) {
        console.log(e)
    }
}
export async function getUsersDownvotedPostIdsArray(currentUser) {
    let postIdsArray = []
    try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.email))
        if(docSnap.exists()) {
            postIdsArray = docSnap.data().downvotedPosts
        }
        return postIdsArray
    }
    catch(e) {
        console.log(e)
    }
}
export async function getUsersUpvotedCommentIdsArray(currentUser) {
    let commentIdsArray = []
    try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.email))
        if(docSnap.exists()) {
            commentIdsArray = docSnap.data().upvotedComments
        }
        return commentIdsArray
    }
    catch(e) {
        console.log(e)
    }
}
export async function getUsersDownvotedCommentIdsArray(currentUser) {
    let commentIdsArray = []
    try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.email))
        if(docSnap.exists()) {
            commentIdsArray = docSnap.data().downvotedComments
        }
        return commentIdsArray
    }
    catch(e) {
        console.log(e)
    }
}
export async function checkIfCurrentPostInUsersUpvotedPostIdsArray(post, userUpvotedPostIdsArray) {
    if(userUpvotedPostIdsArray.includes(post.id)) {
        return true
    }
}
export async function checkIfCurrentPostInUsersDownvotedPostIdsArray(post, userDownvotedPostIdsArray) {
    if(userDownvotedPostIdsArray.includes(post.id)) {
        return true
    }
}