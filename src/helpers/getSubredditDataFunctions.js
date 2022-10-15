import { doc, getDoc, getDocs, setDoc, serverTimestamp, collection} from "firebase/firestore";
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
            id: uniqueId,
            subredditId: id
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
export async function fetchSubredditPosts(setSubredditPostsData, setLoading, id) {
    let data = []
    try {
        const querySnapshot = await getDocs(collection(db, 'subreddits', id, 'posts'))
        querySnapshot.forEach( async (post) => {
            data.push({...post.data()})    
        })   
        if(data.length === querySnapshot.size) {
            setSubredditPostsData(data)
            setLoading(false)
        }
    }    
    catch(e) {
        console.log(e)
    }
}

export async function getHomePagePosts(currentUser, setHomepagePostsData, setLoading) {
    let joinedSubredditsArray = []
    let popularPosts = []
    async function getUsersJoinedSubredditsArray(currentUser) {
        try {
            const docSnap = await getDoc(doc(db, 'users', currentUser.email))
            joinedSubredditsArray = docSnap.data().joinedSubreddits
        }
        catch(e) {
            throw(e)
        }
    }
    async function getPostsFromJoinedSubreddits(joinedSubredditsArray) {
            joinedSubredditsArray.forEach(async (subreddit) => {
                try {
                    const querySnapshot = await getDocs(collection(db, 'subreddits', subreddit, 'posts'))
                    querySnapshot.forEach((post) => {
                        popularPosts.push(post.data())
                    })
                }
                catch(e) {
                    console.log(e)
                }
            })
            setHomepagePostsData(popularPosts)
            setTimeout(() => {setLoading(false)}, 1000)
        }
        

    function randomizePosts(array) {
                let currentIndex = array.length,  randomIndex;
              
                // While there remain elements to shuffle.
                while (currentIndex !== 0) {
              
                  // Pick a remaining element.
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex--;
              
                  // And swap it with the current element.
                  [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
                }
                return array
        }
    
    try {
        await getUsersJoinedSubredditsArray(currentUser)
        try {
            await getPostsFromJoinedSubreddits(joinedSubredditsArray)
        }
        catch(e) {
            console.log(e)
        }
    }
    catch(e) {
        throw(e)
    }
}
