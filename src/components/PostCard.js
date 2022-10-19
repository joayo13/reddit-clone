import React, { useEffect, useState } from 'react'
import { getDatefromSeconds } from '../helpers/getDate'
import {Timestamp,} from "firebase/firestore";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { determineUpvoteCountElementColor, displayUpvotedOrDownvoted, downvotePost, getPostUpvotes, upvotePost } from '../helpers/upvoteFunctions';

function PostCard(props) {
    const navigate = useNavigate()
    const {post, index, id} = props
    const {currentUser} = useAuth()
    const [upvotes, setUpvotes] = useState(0)
    const [isUpvotedByUser, setIsUpvotedByUser] = useState(false)
    const [isDownvotedByUser, setIsDownvotedByUser] = useState(false)
    const [loading, setLoading] = useState(false)
    

    
    useEffect(() => {
        if(!currentUser) return 
        async function displayVoteState() {
            await displayUpvotedOrDownvoted(post, currentUser, setIsUpvotedByUser, setIsDownvotedByUser)
        }
        displayVoteState()
    })
    
    useEffect(() => {
        async function getPostUpvoteData() {
            await getPostUpvotes(post, setUpvotes)
        }
        getPostUpvoteData()
    })
    
  return (
    <>
    <li key={index} className='flex flex-col gap-2 px-4 py-4 bg-white border border-gray-200 rounded-sm dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700'>
        <a onClick={() => navigate(`/r/${id}/comments/${post.id}`)} className='flex flex-col gap-2'>
        <p className='text-xs text-gray-500'>Posted by u/{post.author} {getDatefromSeconds(post.timestamp?.seconds, Timestamp.now().seconds)}</p>
        <h1 className='break-words'>{post.postTitle}</h1>
        <img  src={post.imageURL}></img>
        </a>
        <ul className='flex gap-2'>
            <li className='flex gap-2 font-semibold'>
                <button disabled={loading} onClick={() => upvotePost(setLoading, post, id, currentUser)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isUpvotedByUser ? "#ff4500" : "#424444"} strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                </button>
                <p style={{color: determineUpvoteCountElementColor(isUpvotedByUser, isDownvotedByUser)}}>{upvotes}</p>
                <button disabled={loading} onClick={() => downvotePost(setLoading, post, id, currentUser)}>
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

export default PostCard