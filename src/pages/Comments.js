import { React, useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getDatefromSeconds } from '../helpers/getDate'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, getDocs, setDoc, collection, Timestamp, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore'
import uniqid from 'uniqid'
import Thread from '../components/Thread'
import { determineUpvoteCountElementColor, displayUpvotedOrDownvoted, downvotePost, getPostUpvotes, upvotePost } from '../helpers/upvoteFunctions'
import LoadingWheel from '../components/LoadingWheel'
import { deletePost, editPost } from '../helpers/postFunctions'
import { userJoinSubreddit, userLeaveSubreddit } from '../helpers/userJoinSubreddit'

function Comments (props) {
  const { currentUser, userInfo } = useAuth()
  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [postMetaData, setPostMetaData] = useState({})
  const [commentMetaData, setCommentMetaData] = useState({})
  const [replyToId, setReplyToId] = useState(null)
  const navigate = useNavigate()
  const { id, post } = useParams()
  const commentTextRef = useRef()
  const editedTextRef = useRef()
  const [subredditMetaData, setSubredditMetaData] = useState({})
  const [postUpvotes, setPostUpvotes] = useState(0)
  const [isUpvotedByUser, setIsUpvotedByUser] = useState(false)
  const [isDownvotedByUser, setIsDownvotedByUser] = useState(false)
  const [authorMenuVisible, setAuthorMenuVisible] = useState(false)
  const [userHasJoined, setUserHasJoined] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [error, setError] = useState('')

  async function postComment () {
    const uniqueId = uniqid()
    try {
      await setDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', uniqueId), {
        author: userInfo.username,
        authorProfilePicture: userInfo.profilePicture,
        timestamp: serverTimestamp(),
        text: commentTextRef.current.value,
        postedIn: id,
        id: uniqueId
      })
      await setDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', uniqueId, 'feelings', 'upvotes'), {
        upvotes: 0
      })
      if (postMetaData.author !== userInfo.username) {
        await updateDoc(doc(db, 'notifications', postMetaData.author), {
          notifications: arrayUnion({ message: `${userInfo.username} commented on your post`, sender: `r/${id}`, timestamp: Timestamp.now().seconds, link: `/r/${id}/comments/${post}` })
        })
      }
      setCommentMetaData(prev => prev.concat({
        author: userInfo.username,
        authorProfilePicture: userInfo.profilePicture,
        timestamp: serverTimestamp(),
        text: commentTextRef.current.value,
        postedIn: id,
        id: uniqueId
      }))
      commentTextRef.current.value = ''
    } catch (e) {
      console.log(e)
    }
  }

  async function postReply (parentCommentId) {
    const uniqueId = uniqid()
    try {
      await setDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', uniqueId), {
        author: userInfo.username,
        authorProfilePicture: userInfo.profilePicture,
        timestamp: serverTimestamp(),
        text: commentTextRef.current.value,
        id: uniqueId,
        postedIn: id,
        replyTo: parentCommentId
      })
      await setDoc(doc(db, 'subreddits', id, 'posts', post, 'comments', uniqueId, 'feelings', 'upvotes'), {
        upvotes: 0
      })
      if (postMetaData.author !== userInfo.username) {
        await updateDoc(doc(db, 'notifications', postMetaData.author), {
          notifications: arrayUnion({ message: `${userInfo.username} replied to your comment`, sender: `r/${id}`, timestamp: Timestamp.now().seconds, link: `/r/${id}/comments/${post}` })
        })
      }
      setCommentMetaData(prev => prev.concat({
        author: userInfo.username,
        authorProfilePicture: userInfo.profilePicture,
        timestamp: serverTimestamp(),
        text: commentTextRef.current.value,
        id: uniqueId,
        postedIn: id,
        replyTo: parentCommentId
      }))
      setReplyToId(null)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    async function fetchSubredditData () {
      try {
        const docSnap = await getDoc(doc(db, 'subreddits', id))
        if (docSnap.exists()) {
          setSubredditMetaData(docSnap.data())
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchSubredditData()
    async function fetchSubredditPostMetaData () {
      try {
        const docSnap = await getDoc(doc(db, 'subreddits', id, 'posts', post))
        setPostMetaData({ ...docSnap.data() })
      } catch (e) {
        console.log(e)
      }
    }
    fetchSubredditPostMetaData()

    async function fetchSubredditPostCommentData () {
      const data = []
      try {
        const querySnapshot = await getDocs(collection(db, 'subreddits', id, 'posts', post, 'comments'))
        querySnapshot.forEach((doc) => {
          data.push(doc.data())
        })
        if (querySnapshot.size === data.length) {
          setCommentMetaData(data)
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSubredditPostCommentData()
  }, [id, post])
  useEffect(() => {
    async function checkIfUserHasJoined () {
      if (userHasJoined) return
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
      if (docSnap.data().joinedSubreddits.includes(subredditMetaData.title)) {
        setUserHasJoined(true)
      }
    }
    checkIfUserHasJoined()
  })
  useEffect(() => {
    if (!currentUser || loading) return
    async function displayVoteState () {
      await displayUpvotedOrDownvoted(postMetaData, currentUser, setIsUpvotedByUser, setIsDownvotedByUser)
    }
    displayVoteState()
  })

  useEffect(() => {
    if (loading) return
    async function getPostUpvoteData () {
      await getPostUpvotes(postMetaData, setPostUpvotes)
    }
    getPostUpvoteData()
  })

  const editModeToggle = () => {
    if (currentUser.displayName !== postMetaData.author) {
      setError('Only the author of this post can edit it.')
      return
    }
    setEditMode(!editMode)
  }

  return (
    <>{loading
      ? <LoadingWheel/>
      : <div className='bg-neutral-200 dark:bg-[#030303] min-h-screen'>
            <div className='flex flex-col-reverse md:flex-row justify-center md:py-4 gap-4 text-neutral-800'>
                <ul className='flex relative flex-col lg:w-[40rem] md:w-[30rem] dark:bg-neutral-900 bg-white px-4 pb-4 gap-4 rounded-md border border-neutral-300 dark:border-neutral-800'>
                <div className='hidden md:flex flex-col justify-evenly items-center h-20 absolute left-0 top-4 w-10 dark:text-white text-sm font-bold'>
                    <button disabled={buttonLoading} onClick={() => upvotePost(setButtonLoading, postMetaData, id, currentUser)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={ isUpvotedByUser ? '#ff4500' : '#737373'} strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>
                    </button>
                    <p style={{ color: determineUpvoteCountElementColor(isUpvotedByUser, isDownvotedByUser) }}>{postUpvotes}</p>
                    <button disabled={buttonLoading} onClick={() => downvotePost(setButtonLoading, postMetaData, id, currentUser)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={ isDownvotedByUser ? '#7193ff' : '#737373'} strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                    </svg>
                    </button>
                </div>
                <div>
                    <svg onClick={() => setAuthorMenuVisible(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 absolute right-2 top-2 dark:text-white opacity-50 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                    {authorMenuVisible
                      ? <ul className='flex flex-col gap-4 absolute right-2 top-10 dark:text-white dark:bg-neutral-800 bg-white z-20 px-4 py-4 rounded-md shadow-lg'>
                        <li className='flex gap-2 cursor-pointer' onClick={() => deletePost(postMetaData, userInfo, setError, subredditMetaData)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Delete Post
                        </li>
                        <li onClick={() => { editModeToggle() }} className='flex gap-2 cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Edit Post
                        </li>
                    </ul>
                      : null}
                </div>
                <section className='dark:text-white md:px-8'>
                    <span className='flex gap-2 items-center'>
                        <p className='font-bold text-sm cursor-pointer' onClick={() => navigate(`/r/${subredditMetaData.title}`)}>r/{subredditMetaData.title}</p>
                        <p className=' text-xs opacity-50'>u/{postMetaData.author} {getDatefromSeconds(postMetaData.timestamp?.seconds, Timestamp.now().seconds)}</p>
                    </span>
                    {error &&
                    <div className='w-full bg-red-700 p-4 font-semibold rounded-md mt-4 text-white relative flex gap-2'>
                        <button onClick={() => setError('')} className='top-0 right-2 text-md absolute'>x</button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        {error}
                    </div>}
                    <h1 className='py-2 text-2xl break-words'>{postMetaData.postTitle}</h1>
                    {postMetaData.url?.link ? <li><a className='text-blue-500 underline' href={postMetaData.url.link}>{postMetaData.url.title || postMetaData.url.link}</a></li> : null}
                    <img className='z-10' src={postMetaData.imageURL}></img>
                    {!postMetaData.postTitle ? <p>[deleted]</p> : null}
                    {!editMode
                      ? <p className='py-2 text-sm break-words'>{postMetaData.text}</p>
                      : <div>
                        <textarea ref={editedTextRef} defaultValue={postMetaData.text} className='bg-inherit w-full border dark:border-neutral-700 h-28'></textarea>
                        <button onClick={() => editPost(postMetaData, userInfo, setError, editedTextRef.current.value) } className='ml-auto block bg-blue-500 text-white font-semibold rounded-full py-1 mt-2 px-4'>Save</button>
                        </div>}
                    <li className='flex gap-2 mt-4'>
                      <button className='md:hidden' disabled={buttonLoading} onClick={() => upvotePost(setButtonLoading, postMetaData, id, currentUser)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isUpvotedByUser ? '#ff4500' : '#424444'} strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                      </svg>
                      </button>
                      <p className='md:hidden' style={{ color: determineUpvoteCountElementColor(isUpvotedByUser, isDownvotedByUser) }}>{postUpvotes}</p>
                      <button className='md:hidden' disabled={buttonLoading} onClick={() => downvotePost(setButtonLoading, postMetaData, id, currentUser)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ isDownvotedByUser ? '#7193ff' : '#424444'} strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                      </svg>
                      </button>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p className='opacity-50'>{commentMetaData.length} Comments</p>
                    </li>
                    <textarea ref={commentTextRef} placeholder='What are your thoughts?' className='w-full outline-none dark:bg-inherit border dark:border-neutral-700 indent-2 rounded-sm py-1 h-28 mt-4'></textarea>
                    <div className='w-full mt-4'>
                    <button onClick={() => postComment()} className='ml-auto block bg-blue-500 text-white font-semibold rounded-full py-1 px-4'>Comment</button>
                    </div>
                </section>
                <section className='flex flex-col gap-4'>
                    {<Thread commentMetaData = {commentMetaData} setReplyToId = {setReplyToId} postReply={postReply}
                    getDatefromSeconds={getDatefromSeconds} replyToId={replyToId} Timestamp={Timestamp} commentTextRef={commentTextRef}/>}
                </section>
                </ul>
                <ul className='md:flex flex-col hidden md:gap-4 lg:w-[20rem] md:w-[15rem]'>
                    <li className='flex py-4 px-4 flex-col bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 className='text-md dark:text-white font-semibold'>About Community</h2>
                        <div className='flex gap-2 items-center'>
                          <div className='w-16 h-16 rounded-full overflow-hidden flex items-center justify-center' style={{ backgroundColor: subredditMetaData.communityColor }}>
                            <img src={subredditMetaData.communityDisplayPictureURL}></img>
                          </div>
                          <div className='flex flex-col'>
                          <h1 className='text-2xl'>r/{subredditMetaData.title}</h1>
                          <p className='text-sm opacity-50'>Created {subredditMetaData.birthday}</p>
                          </div>
                        </div>
                        <p className='text-sm'>{subredditMetaData.aboutCommunity}</p>
                        <p className='font-semibold text-sm'>{subredditMetaData.joined} Members</p>
                        <button disabled={buttonLoading} onClick={() => !userHasJoined ? userJoinSubreddit(db, currentUser, subredditMetaData.title, setUserHasJoined, setButtonLoading) : userLeaveSubreddit(db, currentUser, subredditMetaData.title, setUserHasJoined, setButtonLoading)} className='py-1 w-72 mb-4 mx-auto bg-blue-500 font-bold rounded-full text-white hover:bg-blue-400 text-sm'>{`${userHasJoined ? 'Unfollow' : 'Follow'}`}</button>
                    </li>
                    <li className='flex flex-col px-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 className='text-xs dark:text-white font-semibold'>R/{subredditMetaData.title.toUpperCase()} RULES</h2>
                        <ol className='flex flex-col gap-2'>
                        <div className='min-h-[1px] w-full bg-neutral-200 dark:bg-neutral-800'></div>
                        {subredditMetaData.subredditRules?.map((rule, index) => <div className='flex flex-col gap-2' key={index}>
                        <li className='text-sm font-bold'>{index + 1}. {rule}</li>
                        <div className='min-h-[1px] w-full bg-neutral-200 dark:bg-neutral-800'></div>
                        </div>)}
                        </ol>
                    </li>
                </ul>
            </div>
            { authorMenuVisible ? <button onClick={() => setAuthorMenuVisible(!authorMenuVisible)} className='fixed z-10 top-12 right-0 bottom-0 left-0 h-full w-full cursor-default'></button> : null}
        </div>}
        </>
  )
}

export default Comments
