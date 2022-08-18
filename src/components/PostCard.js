import React, { useEffect, useState } from 'react'
import { getDatefromSeconds } from '../helpers/getDate'
import { doc, getDoc, getDocs, setDoc, collection, Timestamp, updateDoc, arrayUnion, arrayRemove, increment} from "firebase/firestore";
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';

function PostCard(props) {
    const navigate = useNavigate()
    const {post, index, id} = props
    const {currentUser, userInfo} = useAuth()
    const [upvotes, setUpvotes] = useState(0)
    const [isUpvotedByUser, setIsUpvotedByUser] = useState(false)
    const [isDownvotedByUser, setIsDownvotedByUser] = useState(false)
    const [userUpvotedPostIdsArray, setUserUpvotedPostIdsArray] = useState([])
    const [userDownvotedPostIdsArray, setUserDownvotedPostIdsArray] = useState([])
    const [loading, setLoading] = useState(false)
    

    async function getUsersUpvotedPostIdsArray() {
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
    async function getUsersDownvotedPostIdsArray() {
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
    useEffect(() => {
        async function getPostUpvotes() {
            try {
                const docSnap = await getDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'))
                if(docSnap.exists()) {
                    setUpvotes(docSnap.data().upvotes)
                }
            }
            catch(e) {
                console.log(e)
            }
        }
        getPostUpvotes()
    })

    useEffect(() => {
        async function displayUpvotedOrDownvoted() {
            if(checkIfCurrentPostInUsersUpvotedPostIdsArray(await getUsersUpvotedPostIdsArray()) === true) { 
                setIsUpvotedByUser(true)
                setIsDownvotedByUser(false)
            }
            if(checkIfCurrentPostInUsersDownvotedPostIdsArray(await getUsersDownvotedPostIdsArray()) === true) {
                setIsDownvotedByUser(true)
                setIsUpvotedByUser(false)
            } 
        }
        displayUpvotedOrDownvoted()
    })

    //see if user has upvoted already
    
    function checkIfCurrentPostInUsersUpvotedPostIdsArray(userUpvotedPostIdsArray) {
        if(userUpvotedPostIdsArray.includes(post.id)) {
            return true
        }
    }
    function checkIfCurrentPostInUsersDownvotedPostIdsArray(userDownvotedPostIdsArray) {
        if(userDownvotedPostIdsArray.includes(post.id)) {
            return true
        }
    }


    async function upvotePost () { 
        setLoading(true)
        let voteAmount = 1 // if user is currently downvoting the upvote is worth 2 since there has to be an unlike state in between
        if(checkIfCurrentPostInUsersUpvotedPostIdsArray(await getUsersUpvotedPostIdsArray()) === true) return
        if(checkIfCurrentPostInUsersDownvotedPostIdsArray(await getUsersDownvotedPostIdsArray()) === true) {
            voteAmount = 2
        }
        try {
            await updateDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'), {
                upvotes: increment(voteAmount)
            })
            await updateDoc(doc(db, 'users', currentUser.email,), {
                downvotedPosts: arrayRemove(post.id)
            })
            await updateDoc(doc(db, 'users', currentUser.email), {
                upvotedPosts: arrayUnion(post.id)
            })
        }
        catch(e) {
            console.log(e)
        }
        setLoading(false)
    }
    async function downvotePost () {
        setLoading(true)
        let voteAmount = -1 // if user is currently upvoting the downvote is worth 2 since there has to be an unlike state in between
        if(checkIfCurrentPostInUsersDownvotedPostIdsArray(await getUsersDownvotedPostIdsArray()) === true) return
        if(checkIfCurrentPostInUsersUpvotedPostIdsArray( await getUsersUpvotedPostIdsArray()) === true) {
            voteAmount = -2
        }
        try {
            await updateDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'), {
                upvotes: increment(voteAmount)
            })
            await updateDoc(doc(db, 'users', currentUser.email,), {
                upvotedPosts: arrayRemove(post.id)
            })
            await updateDoc(doc(db, 'users', currentUser.email), {
                downvotedPosts: arrayUnion(post.id)
            })
        }
        catch(e) {
            console.log(e)
        }
        setLoading(false)
    }
    
  return (
    <>
    <li key={index} className='flex flex-col gap-2 px-4 py-4 bg-white border border-gray-200 rounded-sm dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700'>
        <a onClick={() => navigate(`/r/${id}/comments/${post.id}`)} className='flex flex-col gap-2'>
        <p className='text-xs text-gray-500'>Posted by u/{post.author} {getDatefromSeconds(post.timestamp?.seconds, Timestamp.now().seconds)}</p>
        <h1 className='break-words'>{post.postTitle}</h1>
        </a>
        <ul className='flex gap-2'>
            <li className='flex gap-2 font-semibold'>
                <button disabled={loading} onClick={() => upvotePost()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isUpvotedByUser ? "#ff4500" : "currentColor"} strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                </button>
                <p>{upvotes}</p>
                <button disabled={loading} onClick={() => downvotePost()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isDownvotedByUser ? "#7193ff" : "currentColor"} strokeWidth="2">
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
    </>
  )
}

export default PostCard