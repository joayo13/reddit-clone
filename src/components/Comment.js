import { arrayRemove, arrayUnion, doc, getDoc, increment, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { getDatefromSeconds } from '../helpers/getDate'
import { checkIfCurrentPostInUsersDownvotedPostIdsArray, checkIfCurrentPostInUsersUpvotedPostIdsArray, getUsersDownvotedCommentIdsArray, getUsersDownvotedPostIdsArray, getUsersUpvotedCommentIdsArray, getUsersUpvotedPostIdsArray } from '../helpers/upvoteFunctions'
import Reply from './Reply'

function Comment(props) {
    const [buttonLoading, setButtonLoading] = useState(false)
    const [isUpvotedByUser, setIsUpvotedByUser] = useState(false)
    const [isDownvotedByUser, setIsDownvotedByUser] = useState(false)
    const [commentUpvotes, setCommentUpvotes] = useState(false)
    const {comment, setReplyToId, replyToId, commentTextRef, postReply, commentMetaData} = props
    let { id, post} = useParams()
    const {currentUser} = useAuth()
    async function upvoteComment () { 
        setButtonLoading(true)
        let voteAmount = 1 
        if(await checkIfCurrentPostInUsersUpvotedPostIdsArray(comment.id, await getUsersUpvotedCommentIdsArray(currentUser)) === true) {
            //handling unvoting without downvoting
            try {
                await updateDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', comment.id, 'feelings', 'upvotes'), {
                    upvotes: increment(-1)
                })
                await updateDoc(doc(db, 'users', currentUser.email,), {
                    upvotedComments: arrayRemove(comment.id)
                })
                setButtonLoading(false)
                return
            }
            catch(e) {
                console.log(e)
            }
        }
        if(await checkIfCurrentPostInUsersDownvotedPostIdsArray(comment.id, await getUsersDownvotedCommentIdsArray(currentUser)) === true) {
            voteAmount = 2 // if user is currently downvoting the upvote is worth 2 since there has to be an unlike state in between
        }
        try {
            await updateDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', comment.id, 'feelings', 'upvotes'), {
                upvotes: increment(voteAmount)
            })
            await updateDoc(doc(db, 'users', currentUser.email,), {
                downvotedComments: arrayRemove(comment.id)
            })
            await updateDoc(doc(db, 'users', currentUser.email), {
                upvotedComments: arrayUnion(comment.id)
            })
        }
        catch(e) {
            console.log(e)
        }
        setButtonLoading(false)
    }
    async function downvoteComment () {
        setButtonLoading(true)
        let voteAmount = -1 // if user is currently upvoting the downvote is worth 2 since there has to be an unlike state in between
        if(await checkIfCurrentPostInUsersDownvotedPostIdsArray(comment.id, await getUsersDownvotedCommentIdsArray(currentUser)) === true) {
            //handling unvoting without upvoting
            try {
                await updateDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', comment.id, 'feelings', 'upvotes'), {
                    upvotes: increment(1)
                })
                await updateDoc(doc(db, 'users', currentUser.email,), {
                    downvotedComments: arrayRemove(comment.id)
                })
                setButtonLoading(false)
                return
            }
            catch(e) {
                console.log(e)
            }
        }
        if(await checkIfCurrentPostInUsersUpvotedPostIdsArray(comment.id, await getUsersUpvotedCommentIdsArray(currentUser)) === true) {
            voteAmount = -2
        }
        try {
            await updateDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', comment.id, 'feelings', 'upvotes'), {
                upvotes: increment(voteAmount)
            })
            await updateDoc(doc(db, 'users', currentUser.email,), {
                upvotedComments: arrayRemove(comment.id)
            })
            await updateDoc(doc(db, 'users', currentUser.email), {
                downvotedComments: arrayUnion(comment.id)
            })
        }
        catch(e) {
            console.log(e)
        }
        setButtonLoading(false)
    }
    useEffect(() => {
        if(currentUser == null) return 
        async function displayUpvotedOrDownvoted() {
            if(await checkIfCurrentPostInUsersUpvotedPostIdsArray(comment.id, await getUsersUpvotedCommentIdsArray(currentUser)) === true) { 
                setIsUpvotedByUser(true)
                setIsDownvotedByUser(false)
                return
            }
            if(await checkIfCurrentPostInUsersDownvotedPostIdsArray(comment.id, await getUsersDownvotedCommentIdsArray(currentUser)) === true) {
                setIsDownvotedByUser(true)
                setIsUpvotedByUser(false)
                return
            } 
            setIsDownvotedByUser(false)
            setIsUpvotedByUser(false)
        }
        displayUpvotedOrDownvoted()
    })
    useEffect(() => {
        async function getCommentUpvotes() {
            try {
                const docSnap = await getDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', comment.id, 'feelings', 'upvotes'))
                if(docSnap.exists()) {
                    setCommentUpvotes(docSnap.data().upvotes)
                }
            }
            catch(e) {
                console.log(e)
            }
        }
        getCommentUpvotes()
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
    
  return (
      <>
    <div className='dark:text-white relative'>
                <span className='flex items-center gap-2'>
                    <img src={comment.authorProfilePicture} className={'w-6 h-6 rounded-full z-[1]'}></img>
                    <div className='absolute h-full top-0  left-[0.55rem] w-1 dark:bg-gray-700 bg-gray-300'></div>
                    <h1>{comment.author}</h1>
                    <p className='text-xs opacity-50'>{getDatefromSeconds(comment.timestamp?.seconds, Timestamp.now().seconds)}</p>
                </span>
                <p className='text-sm opacity-90 mt-2 ml-8 break-words'>{comment.text}</p>
                <span className='flex px-8 gap-2 mt-2'>
                    <div className='flex -ml-1 gap-1 text-sm items-center'>
                        <button disabled={buttonLoading} onClick={() => upvoteComment()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke={ isUpvotedByUser ? "#ff4500" : "#424444"} strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                        </svg>
                        </button>
                        <p style={{color: determineUpvoteCountElementColor()}}>{commentUpvotes}</p>
                        <button disabled={buttonLoading} onClick={() => downvoteComment()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke={ isDownvotedByUser ? "#7193ff" : "#424444"} strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                        </svg>
                        </button>
                    </div>
                    <button onClick={() => setReplyToId(comment.id)} className='flex gap-1 text-sm items-center opacity-50'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Reply
                    </button>
                </span>
                {replyToId === comment.id ? 
                <div className='ml-8 relative mt-4'>       
                    <textarea ref={commentTextRef} placeholder='What are your thoughts?' className='w-full outline-none dark:bg-inherit border border-l-4 dark:border-gray-700 border-gray-300 indent-2 rounded-sm py-1 h-28'></textarea>
                    <div className='w-full mt-4'>
                        <button onClick={() => postReply(replyToId)} className='ml-auto block bg-blue-500 text-white rounded-full py-2 px-4'>Reply</button>
                    </div>
                </div> : null}
                {commentMetaData.filter((replyComment) => replyComment.replyTo === comment.id).map((comment, index) => 
                    <Reply commentMetaData={commentMetaData} key={index} index={index} comment={comment} setReplyToId={setReplyToId} replyToId={replyToId} commentTextRef={commentTextRef} postReply={postReply}>
                    </Reply>)}
                </div>
                </>
  )
}

export default Comment