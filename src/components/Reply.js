import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { getDatefromSeconds } from '../helpers/getDate'
import Subreply from './Subreply'

function Reply(props) {
    const {commentMetaData, comment, setReplyToId, replyToId, commentTextRef, postReply} = props
  return (
      <>
    <div className='dark:text-white relative ml-6 mt-2'>
    <span className='flex items-center gap-2'>
        <img src={comment.authorProfilePicture} className={'w-6 h-6 rounded-full z-[1]'}></img>
        <div className='absolute h-full top-0 left-[0.55rem] w-1 dark:bg-gray-700 bg-gray-300'></div>
        <h1>{comment.author}</h1>
        <p className='text-xs opacity-50'>{getDatefromSeconds(comment.timestamp?.seconds, Timestamp.now().seconds)}</p>
    </span>
    <p className='text-sm opacity-90 mt-2 ml-8 break-words'>{comment.text}</p>
    <span className='flex px-8 gap-2 mt-2'>
        <div className='flex -ml-1 gap-1 text-sm items-center opacity-50'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
            0
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
        </div>
        <button onClick={() => setReplyToId(comment.id)} className='flex gap-1 text-sm items-center opacity-50'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
            Reply
        </button>
    </span>
    {replyToId === comment.id ? 
    <div className='ml-8 mt-4 relative'>
        <textarea ref={commentTextRef} placeholder='What are your thoughts?' className='w-full outline-none dark:bg-inherit border indent-2 dark:border-gray-700 border-gray-300 rounded-sm py-1 h-28 border-l-4'></textarea>
        <div className='w-full mt-4'>
            <button onClick={() => postReply(replyToId)} className='ml-auto block bg-blue-500 text-white rounded-full py-2 px-4'>Reply</button>
        </div>
    </div> : null}
    {commentMetaData.filter((subReplyComment) => subReplyComment.replyTo === comment.id).map((comment, index) => 
        <Subreply key={index} index={index} comment={comment} setReplyToId={setReplyToId} replyToId={replyToId} commentTextRef={commentTextRef} postReply={postReply}>
        </Subreply>)}
    </div>
    
    </>
  )
}

export default Reply