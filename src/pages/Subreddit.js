import { React, useEffect, useState, useRef }from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getDatefromSeconds } from '../helpers/getDate'
import { useParams, useNavigate} from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, getDocs, setDoc, serverTimestamp, collection, increment, Timestamp, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { queryByTestId } from '@testing-library/react'

function Subreddit(props) {

    const {currentUser, userInfo} = useAuth()
    const [subredditPostsData, setSubredditPostsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [upvotedPosts, setUpvotedPosts] = useState([])
    const [downvotedPosts, setDownvotedPosts] = useState([])
    const navigate = useNavigate()
 
    let { id } = useParams()

    const {setSubredditMetaData, subredditMetaData} = props

    useEffect(() => {
        async function fetchSubredditData() {
            try {
                const docSnap = await getDoc(doc(db, 'subreddits', id))
                if(docSnap.exists()) {
                    setSubredditMetaData(docSnap.data())
                    fetchSubredditPosts()
                }
            }
            catch(e) {
                console.log(e)
            }
        }
        fetchSubredditData()

        async function fetchSubredditPosts() {
            let data = []
            let upvotesData = []
            let downvotesData = []
            try {
                const querySnapshot = await getDocs(collection(db, 'subreddits', id, 'posts'))
                querySnapshot.forEach( async (post) => {
                        try {
                            const docSnapUpvotes = await getDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'))
                            data.push({
                                ...post.data(), 
                                upvotes: docSnapUpvotes.data() ? docSnapUpvotes.data().upvotes : [], 
                                downvotes: docSnapUpvotes.data() ? docSnapUpvotes.data().downvotes : []
                            })
                            if(docSnapUpvotes.data()?.upvotes.includes(userInfo.username)) {
                                upvotesData.push(post.id)
                            } 
                            if(docSnapUpvotes.data()?.downvotes.includes(userInfo.username)) {
                                downvotesData.push(post.id)
                            } 
                            if(querySnapshot.size === data.length) {
                                setUpvotedPosts(upvotesData)
                                setDownvotedPosts(downvotesData)
                                setSubredditPostsData(data)
                                setLoading(false)
                                return
                            }
                        }
                        catch(e) {
                            console.log(e)
                            setLoading(false)
                        }
                    })  
            }
            catch(e) {
                console.log(e)
            }
            
        }
        fetchSubredditPosts()
    },[userInfo.username, id, setSubredditMetaData])

    
    
    
    async function upvotePost (selectedId) {
        try {
        await updateDoc(doc(db, "subreddits", id, "posts", selectedId, "feelings", "upvotes"), {
            upvotes: arrayUnion(userInfo.username),
            downvotes: arrayRemove(userInfo.username)
        })
            setUpvotedPosts(prev => prev.concat(selectedId))
            setDownvotedPosts(prev => prev.filter((id) => id !== selectedId))
            console.log(downvotedPosts, upvotedPosts)
        } catch(e) {
            try {
                await setDoc(doc(db, "subreddits", id, "posts", selectedId, "feelings", "upvotes"), {
                    upvotes: arrayUnion(userInfo.username),
                    downvotes: arrayRemove(userInfo.username)
                })
                setUpvotedPosts(prev => prev.concat(selectedId))
                setDownvotedPosts(prev => prev.filter((id) => id !== selectedId))
            }
            catch(e) {
                console.log(e)
            }
        }
        
    }
    async function downvotePost (selectedId) {
        try {
        await updateDoc(doc(db, "subreddits", id, "posts", selectedId, "feelings", "upvotes"), {
            downvotes: arrayUnion(userInfo.username),
            upvotes: arrayRemove(userInfo.username)
        })
            setUpvotedPosts(prev => prev.filter((id) => id !== selectedId))
            setDownvotedPosts(prev => prev.concat(selectedId))
        } catch(e) {
            try {
                await setDoc(doc(db, "subreddits", id, "posts", selectedId, "feelings", "upvotes"), {
                    downvotes: arrayUnion(userInfo.username),
                    upvotes: arrayRemove(userInfo.username)
                })
                setUpvotedPosts(prev => prev.filter((id) => id !== selectedId))
                setDownvotedPosts(prev => prev.concat(selectedId))
            }
            catch(e) {
                console.log(e)
            }
        }
        
    }

  return (
    <>{loading ? null :
        <div className='bg-gray-100 dark:bg-black min-h-screen'>
            <section className='flex flex-col items-center md:flex-row md:justify-center gap-4 bg-white dark:bg-gray-900 dark:text-white py-2'>
                <div style={subredditMetaData.communityColor ? {backgroundColor: subredditMetaData.communityColor} : {backgroundColor: 'gray'}} className='w-20 h-20 text-white rounded-full border border-gray-200 dark:border-gray-800 text-center text-7xl'>r/</div>
                <h1 className='font-bold text-3xl text-center'>{subredditMetaData.title}</h1>
                <button className=' border border-gray-800 text-gray-800 w-24 py-1 rounded-full dark:text-white dark:border-white'>Join</button>
            </section>
            <div className='flex flex-col-reverse md:flex-row justify-center mt-4 gap-4'>
                <ul className='flex flex-col gap-4 lg:w-[40rem] md:w-[30rem]'>
                    {currentUser ? 
                    <li className='flex gap-2 px-4 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-sm'>
                        <img src={userInfo.profilePicture} className='w-10 rounded-full'></img>
                        <input type='text' onClick={() => navigate(`/r/${id}/submit`)} placeholder='Create Post' className='w-full outline-none bg-gray-100 dark:bg-gray-800 dark:text-white indent-2 rounded-sm'></input>
                    </li> : null}
                    {subredditPostsData.map((post, index) => 
                        <li key={index} className='flex flex-col gap-2 px-4 py-4 bg-white border border-gray-200 rounded-sm dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700'>
                        <a onClick={() => navigate(`/r/${id}/comments/${post.id}`)} className='flex flex-col gap-2'>
                        <p className='text-xs text-gray-500'>Posted by u/{post.author} {getDatefromSeconds(post.timestamp?.seconds, Timestamp.now().seconds)}</p>
                        <h1 className='break-words'>{post.postTitle}</h1>
                        </a>
                        <ul className='flex gap-2'>
                            <li className='flex gap-2 font-semibold'>
                                <button onClick={() => upvotePost(post.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={upvotedPosts.includes(post.id) ? "#ff4500" : "currentColor"} strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                                </svg>
                                </button>
                                {(post.upvotes?.length - post.downvotes?.length)}
                                <button onClick={() => downvotePost(post.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={downvotedPosts.includes(post.id) ? "#7193ff" : "currentColor"} strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                                </svg>
                                </button>
                            </li>
                            <li className='flex gap-2 opacity-50'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Comments
                            </li>
                        </ul>
                    </li>
                    )}
                </ul>
                <ul className='flex flex-col gap-4 lg:w-[20rem] md:w-[15rem]'>
                    <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                        <h2 className='text-xl font-semibold'>About Community</h2>
                        <p>{subredditMetaData.aboutCommunity}</p>
                        <p className='font-semibold'>0 members</p>
                    </li>
                    <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                        <h2 className='text-xl font-semibold'>Subreddit Rules</h2>
                        <ol className='flex flex-col px-4 gap-4 list-decimal'>
                        {subredditMetaData.subredditRules.map((rule, index) => <li key={index}>{rule}</li>)}
                        </ol>
                    </li>
                </ul>
            </div>
        </div>}
        </>
  )
}

export default Subreddit