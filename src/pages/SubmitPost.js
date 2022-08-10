import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { useParams, useNavigate} from 'react-router-dom'
import { doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";
import uniqid from 'uniqid'


function SubmitPost() {
    const { userInfo } = useAuth()
    const [subredditMetaData, setSubredditMetaData] = useState({})
    const [loading, setLoading] = useState(true)
    let { id } = useParams()
    const postTitleRef = useRef()
    const postTextRef = useRef()
    const navigate = useNavigate()

    async function createPost() {
        const uniqueId = uniqid()
        try {
            await setDoc(doc(db, "subreddits", id, "posts", uniqueId), {
                postTitle: postTitleRef.current.value,
                author: userInfo.username,
                timestamp: serverTimestamp(),
                text: postTextRef.current.value,
                upvotes: 0,
                id: uniqueId
            })
            navigate(`/r/${id}`)
        }
        catch(e) {
            console.log(e)
        }
    }

    async function fetchSubredditData() {
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
    useEffect(() => {
        fetchSubredditData()
    },[])
  return (
    <>{loading ? null :
        <div className='bg-gray-100 dark:bg-black min-h-screen'>
                <div className='flex md:flex-row justify-center py-4 gap-4'>
                    <ul className='flex flex-col lg:w-[40rem] md:w-[30rem] w-full'>
                    <h1 className='dark:text-white text-black mb-4'>Create a post</h1>
                        <li className='flex px-4 py-4 bg-white dark:bg-gray-900  border-gray-200 rounded-t-md'>
                            <input type='text' ref={postTitleRef} placeholder='Title' maxLength={300} className='w-full outline-none border dark:bg-gray-800 dark:text-white indent-2 rounded-sm py-1'></input>
                        </li>
                        <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border-gray-200 rounded-b-md'>
                            <textarea ref={postTextRef} placeholder='Text(optional)' className='w-full outline-nonedark:bg-gray-800 dark:bg-gray-800 dark:text-white border indent-2 rounded-sm py-1 h-28'></textarea>
                            <button onClick={() => createPost()} className='dark:bg-white bg-gray-800 dark:text-black text-white w-20 py-1 mt-4 rounded-full'>Post</button>
                        </li>
                    </ul>
                    <ul className='hidden md:flex flex-col gap-4 lg:w-[20rem] md:w-[15rem]'>
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

export default SubmitPost