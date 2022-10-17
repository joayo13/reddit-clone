import { React, useEffect, useState, useRef }from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getDatefromSeconds } from '../helpers/getDate'
import { useParams, useNavigate} from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, getDocs, setDoc, collection, Timestamp, serverTimestamp} from "firebase/firestore";
import uniqid from 'uniqid'
import Thread from '../components/Thread'
import { determineUpvoteCountElementColor, displayUpvotedOrDownvoted, downvotePost, getPostUpvotes, upvotePost } from '../helpers/upvoteFunctions'

function Comments(props) {

    const {currentUser, userInfo} = useAuth()
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [postMetaData, setPostMetaData] = useState({})
    const [commentMetaData, setCommentMetaData] = useState({})
    const [replyToId, setReplyToId] = useState(null)
    const navigate = useNavigate()
    let { id, post } = useParams()
    const commentTextRef = useRef()
    const [subredditMetaData, setSubredditMetaData] = useState({})
    const [postUpvotes, setPostUpvotes] = useState(0)
    const [isUpvotedByUser, setIsUpvotedByUser] = useState(false)
    const [isDownvotedByUser, setIsDownvotedByUser] = useState(false)
 
    async function postComment() {
        const uniqueId = uniqid()
        try {
            await setDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', uniqueId), {
                author: userInfo.username,
                authorProfilePicture: userInfo.profilePicture,
                timestamp: serverTimestamp(),
                text: commentTextRef.current.value,
                id: uniqueId,
            })
            await setDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', uniqueId, 'feelings', 'upvotes'), {
                upvotes: 0
            })
            setCommentMetaData(prev => prev.concat({
                author: userInfo.username,
                authorProfilePicture: userInfo.profilePicture,
                timestamp: serverTimestamp(),
                text: commentTextRef.current.value,
                id: uniqueId,
            }))
            commentTextRef.current.value = ''
        }
        catch(e) {
            console.log(e)
        }
    }

    async function postReply(parentCommentId) {
        const uniqueId = uniqid()
        try {
            await setDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', uniqueId), {
                author: userInfo.username,
                authorProfilePicture: userInfo.profilePicture,
                timestamp: serverTimestamp(),
                text: commentTextRef.current.value,
                id: uniqueId,
                replyTo: parentCommentId,
            })
            await setDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', uniqueId, 'feelings', 'upvotes'), {
                upvotes: 0
            })
            setCommentMetaData(prev => prev.concat({
                author: userInfo.username,
                authorProfilePicture: userInfo.profilePicture,
                timestamp: serverTimestamp(),
                text: commentTextRef.current.value,
                id: uniqueId,
                replyTo: parentCommentId,
            }))
            setReplyToId(null)
        }
        catch(e) {
            console.log(e)
        }
    }
    
    

    useEffect(() => {
        async function fetchSubredditData() {
            try {
                const docSnap = await getDoc(doc(db, 'subreddits', id))
                if(docSnap.exists()) {
                    setSubredditMetaData(docSnap.data())
                }
            }
            catch(e) {
                console.log(e)
            }
        }
        fetchSubredditData()
        async function fetchSubredditPostMetaData() {
            try {
                const docSnap = await getDoc(doc(db, 'subreddits', id, 'posts', post))
                setPostMetaData({...docSnap.data()})
            }
            catch(e) {
                console.log(e)
            }
        }
        fetchSubredditPostMetaData()

        async function fetchSubredditPostCommentData() {
            let data = []
            try {
                const querySnapshot = await getDocs(collection(db, 'subreddits', id, 'posts', post, 'comments'))
                querySnapshot.forEach((doc) => {
                    data.push( doc.data())
                })
                
                if(querySnapshot.size === data.length) {
                    setCommentMetaData(data)
                }
            }
            catch(e) {
                console.log(e)
            }
            finally {
                setLoading(false)
            }
        }
        fetchSubredditPostCommentData()
    },[id, post])

    useEffect(() => {
        if(!currentUser || loading) return 
        async function displayVoteState() {
            await displayUpvotedOrDownvoted(postMetaData, currentUser, setIsUpvotedByUser, setIsDownvotedByUser)
        }
        displayVoteState()
    })
    
    useEffect(() => {
        if(loading) return 
        async function getPostUpvoteData() {
            await getPostUpvotes(postMetaData, setPostUpvotes)
        }
        getPostUpvoteData()
    })

  return (
    <>{loading ? null :
        <div className='bg-gray-100 dark:bg-black min-h-screen'>
            <div className='flex flex-col-reverse md:flex-row justify-center md:py-4 gap-4'>
                <ul className='flex relative flex-col lg:w-[40rem] md:w-[30rem] dark:bg-gray-900 bg-white px-4 py-4'>
                <div className='flex flex-col justify-evenly items-center h-20 absolute left-0 top-4 w-10 dark:text-white text-sm font-bold'>
                    <button disabled={buttonLoading} onClick={() => upvotePost(setButtonLoading, postMetaData, id, currentUser)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={ isUpvotedByUser ? "#ff4500" : "#424444"} strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>
                    </button>
                    <p style={{color: determineUpvoteCountElementColor(isUpvotedByUser, isDownvotedByUser)}}>{postUpvotes}</p>
                    <button disabled={buttonLoading} onClick={() => downvotePost(setButtonLoading, postMetaData, id, currentUser)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={ isDownvotedByUser ? "#7193ff" : "#424444"} strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                    </svg>
                    </button>
                </div>
                <section className='dark:text-white px-8'>
                    <span className='flex gap-2 items-center'>
                        <p className='font-bold text-sm'>r/{subredditMetaData.title}</p>
                        <p className=' text-xs opacity-50'>u/{postMetaData.author} {getDatefromSeconds(postMetaData.timestamp?.seconds, Timestamp.now().seconds)}</p>
                    </span>
                    <h1 className='mt-4 text-2xl break-words'>{postMetaData.postTitle}</h1>
                    <p className='mt-4 text-sm break-words'>{postMetaData.text}</p>
                    <li className='flex gap-2 opacity-50 mt-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {commentMetaData.length} Comments
                    </li>
                    <textarea ref={commentTextRef} placeholder='What are your thoughts?' className='w-full outline-none dark:bg-inherit border dark:border-gray-700 indent-2 rounded-sm py-1 h-28 mt-4'></textarea>
                    <div className='w-full mt-4'>
                    <button onClick={() => postComment()} className='ml-auto block bg-blue-500 text-white rounded-full py-2 px-4'>Comment</button>
                    </div>
                </section>
                <section className='flex flex-col gap-4'>
                    {<Thread commentMetaData = {commentMetaData} setReplyToId = {setReplyToId} postReply={postReply} 
                    getDatefromSeconds={getDatefromSeconds} replyToId={replyToId} Timestamp={Timestamp} commentTextRef={commentTextRef}/>}   
                </section>
                </ul>
                <ul className='flex-col hidden md:flex gap-4 lg:w-[20rem] md:w-[15rem]'>
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

export default Comments