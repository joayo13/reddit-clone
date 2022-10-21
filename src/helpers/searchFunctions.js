import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";



export async function searchSubreddit (chars) {
    if(!chars) return 
    let matchedSubreddits = []
    try {
        const querySnapshot = await getDocs(collection(db, 'subreddits'))
    querySnapshot.forEach((post) => {
        if(post.data().title.includes(chars)) {
            console.log(post.data().title)
        }
    })
    }
    catch(e) {
        console.log(e)
    }
}