import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { useParams, useNavigate} from 'react-router-dom'
import { doc, getDoc, getDocs, addDoc, setDoc, collection, serverTimestamp} from "firebase/firestore";
import uniqid from 'uniqid'


function SubmitPost() {
    const {currentUser, logOut, setUserInfo, userInfo} = useAuth()
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
        <div className='bg-slate-100 dark:bg-black min-h-screen'>
                <div className='flex md:flex-row justify-center py-4 gap-4'>
                    <ul className='flex flex-col lg:w-[40rem] md:w-[30rem] w-full'>
                    <h1 className='dark:text-white text-black mb-4'>Create a post</h1>
                    <span className='w-full dark:bg-white bg-slate-200 h-px mb-4'></span>
                        <li className='flex px-4 py-4 bg-white dark:bg-slate-900  border-slate-200 rounded-t-md'>
                            <input type='text' ref={postTitleRef} placeholder='Title' maxLength={300} className='w-full outline-none bg-slate-100 dark:bg-slate-800 dark:text-white indent-2 rounded-md py-1'></input>
                        </li>
                        <li className='flex flex-col px-4 py-4 bg-white dark:bg-slate-900 border-slate-200 rounded-b-md'>
                            <textarea ref={postTextRef} placeholder='Text(optional)' className='w-full outline-none bg-slate-100 dark:bg-slate-800 dark:text-white indent-2 rounded-md py-1 h-28'></textarea>
                            <button onClick={() => createPost()} className='dark:bg-white bg-slate-800 dark:text-black text-white w-20 py-1 mt-4 rounded-full'>Post</button>
                        </li>
                    </ul>
                    <ul className='hidden md:flex flex-col gap-4 lg:w-[20rem] md:w-[15rem]'>
                        <li className='flex flex-col px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-slate-300 gap-4 rounded-md'>
                            <h2 className='text-xl font-semibold'>About Community</h2>
                            <p>{subredditMetaData.aboutCommunity}</p>
                            <p className='font-semibold'>0 members</p>
                        </li>
                        <li className='flex flex-col px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-slate-300 gap-4 rounded-md'>
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