/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { getDatefromSeconds } from '../helpers/getDate'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { determineUpvoteCountElementColor, displayUpvotedOrDownvoted, downvotePost, getPostUpvotes, upvotePost } from '../helpers/upvoteFunctions'
import { db } from '../firebase'

function HomePostCard (props) {
  const navigate = useNavigate()
  const { post, index } = props
  const { currentUser } = useAuth()
  const [upvotes, setUpvotes] = useState(0)
  const [isUpvotedByUser, setIsUpvotedByUser] = useState(false)
  const [isDownvotedByUser, setIsDownvotedByUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [commentLength, setCommentLength] = useState(0)

  useEffect(() => {
    if (!currentUser) return
    async function displayVoteState () {
      await displayUpvotedOrDownvoted(post, currentUser, setIsUpvotedByUser, setIsDownvotedByUser)
    }
    displayVoteState()
  })
  useEffect(() => {
    async function getPostUpvoteData () {
      await getPostUpvotes(post, setUpvotes)
    }
    getPostUpvoteData()
  })
  useEffect(() => {
    async function fetchSubredditPostCommentData () {
      const querySnapshot = await getDocs(collection(db, 'subreddits', post.subredditId, 'posts', post.id, 'comments'))
      setCommentLength(querySnapshot.size)
    }
    fetchSubredditPostCommentData()
  }, [])
  return (
    <>
    <li key={index} className='flex flex-col gap-2 px-4 py-4 bg-white border border-neutral-300 rounded-md dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 dark:border-neutral-800'>
        <div className='flex cursor-pointer flex-col gap-2'>
        <span onClick={() => navigate(`/r/${post.subredditId}`)} className='flex text-xs gap-2'>
        <a className='font-bold'>r/{post.subredditId}</a>
        <p className='text-neutral-500'>Posted by u/{post.author} {getDatefromSeconds(post.timestamp?.seconds, Timestamp.now().seconds)}</p>
        </span>
        <h1 onClick={() => navigate(`/r/${post.subredditId}/comments/${post.id}`)} className='break-words'>{post.postTitle}</h1>
        <img onClick={() => navigate(`/r/${post.subredditId}/comments/${post.id}`)} src={post.imageURL}></img>
        </div>
        <ul className='flex gap-2' onClick={() => navigate(`/r/${post.subredditId}/comments/${post.id}`)}>
            <li className='flex gap-2 font-semibold'>
                <button disabled={loading} onClick={() => upvotePost(setLoading, post, post.subredditId, currentUser)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isUpvotedByUser ? '#ff4500' : '#717781'} strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                </button>
                <p style={{ color: determineUpvoteCountElementColor(isUpvotedByUser, isDownvotedByUser) }}>{upvotes}</p>
                <button disabled={loading} onClick={() => downvotePost(setLoading, post, post.subredditId, currentUser)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isDownvotedByUser ? '#7193ff' : '#717781'} strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
                </button>
            </li>
            <li className='flex gap-2 cursor-pointer dark:text-[#717781]' >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#717781" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {commentLength} Comments
            </li>
        </ul>
    </li>
    </>
  )
}

export default HomePostCard
