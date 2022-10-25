import { doc, getDoc, getDocs, setDoc, serverTimestamp, collection} from "firebase/firestore";
import uniqid from 'uniqid'
import { db } from '../firebase'


export async function getTopSubreddits(setTopSubreddits) {
    let topSubreddits = []
    try {
        const querySnapshot = await getDocs(collection(db, 'subreddits'))
    querySnapshot.forEach((subreddit) => {
        topSubreddits.push(subreddit.data())
    })
    }
    catch(e) {
        console.log(e)
    }
    finally {
        setTopSubreddits(topSubreddits.sort((a, b) => a.joined - b.joined))
    }
}