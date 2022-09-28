import React, { useEffect, useState } from 'react'
import { getDatefromSeconds } from '../helpers/getDate'
import { doc, getDoc, getDocs, setDoc, collection, Timestamp, updateDoc, arrayUnion, arrayRemove, increment} from "firebase/firestore";
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';

function HomePostCard(props) {
    const navigate = useNavigate()
    const {post, index, id} = props
    const {currentUser} = useAuth()
    const [upvotes, setUpvotes] = useState(0)
    const [isUpvotedByUser, setIsUpvotedByUser] = useState(false)
    const [isDownvotedByUser, setIsDownvotedByUser] = useState(false)
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
        if(!currentUser) return 
        async function displayUpvotedOrDownvoted() {
            if(checkIfCurrentPostInUsersUpvotedPostIdsArray(await getUsersUpvotedPostIdsArray(currentUser)) === true) { 
                setIsUpvotedByUser(true)
                setIsDownvotedByUser(false)
                return
            }
            if(checkIfCurrentPostInUsersDownvotedPostIdsArray(await getUsersDownvotedPostIdsArray(currentUser)) === true) {
                setIsDownvotedByUser(true)
                setIsUpvotedByUser(false)
                return
            } 
            setIsDownvotedByUser(false)
            setIsUpvotedByUser(false)
        }
        displayUpvotedOrDownvoted()
    })

    function determineUpvoteCountElementColor() {
        if(isUpvotedByUser) {
            return '#ff4500'
        }
        if(isDownvotedByUser) {
            return '#7193ff'
        }
        return '#424444'
    }


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
        let voteAmount = 1 
        if(checkIfCurrentPostInUsersUpvotedPostIdsArray(await getUsersUpvotedPostIdsArray()) === true) {
            //handling unvoting without downvoting
            try {
                await updateDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'), {
                    upvotes: increment(-1)
                })
                await updateDoc(doc(db, 'users', currentUser.email,), {
                    upvotedPosts: arrayRemove(post.id)
                })
                setLoading(false)
                return
            }
            catch(e) {
                console.log(e)
            }
        }
        if(checkIfCurrentPostInUsersDownvotedPostIdsArray(await getUsersDownvotedPostIdsArray()) === true) {
            voteAmount = 2 // if user is currently downvoting the upvote is worth 2 since there has to be an unlike state in between
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
        if(checkIfCurrentPostInUsersDownvotedPostIdsArray(await getUsersDownvotedPostIdsArray()) === true) {
            //handling unvoting without upvoting
            try {
                await updateDoc(doc(db, 'subreddits', id, 'posts', post.id, 'feelings', 'upvotes'), {
                    upvotes: increment(1)
                })
                await updateDoc(doc(db, 'users', currentUser.email,), {
                    downvotedPosts: arrayRemove(post.id)
                })
                setLoading(false)
                return
            }
            catch(e) {
                console.log(e)
            }
        }
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
        <div onClick={() => navigate(`/r/${id}/comments/${post.id}`)} className='flex flex-col gap-2'>
        <span className='flex text-xs gap-2'>
        <a className='font-bold' href={`/r/${id}`}>r/{id}</a>
        <p className='text-gray-500'>Posted by u/{post.author} {getDatefromSeconds(post.timestamp?.seconds, Timestamp.now().seconds)}</p>
        </span>
        <h1 className='break-words'>{post.postTitle}</h1>
        </div>
        <ul className='flex gap-2'>
            <li className='flex gap-2 font-semibold'>
                <button disabled={loading} onClick={() => upvotePost()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isUpvotedByUser ? "#ff4500" : "#424444"} strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                </button>
                <p style={{color: determineUpvoteCountElementColor()}}>{upvotes}</p>
                <button disabled={loading} onClick={() => downvotePost()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isDownvotedByUser ? "#7193ff" : "#424444"} strokeWidth="2">
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

export default HomePostCard