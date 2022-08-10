import { React, useEffect, useState, useRef }from 'react'
import redditIcon from '../images/reddit-icon.png'
import { useAuth } from '../contexts/AuthContext'
import { getDatefromSeconds } from '../helpers/getDate'
import { useParams, useNavigate} from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, getDocs, setDoc, collection, Timestamp } from "firebase/firestore";

function Comments(props) {

    const {currentUser, userInfo} = useAuth()
    const [loading, setLoading] = useState(true)
    const [postMetaData, setPostMetaData] = useState({})
    const navigate = useNavigate()
    let { id, post } = useParams()

    async function fetchSubredditData() {
        try {
            const docSnap = await getDoc(doc(db, 'subreddits', id))
            if(docSnap.exists()) {
                props.setSubredditMetaData(docSnap.data())
            }
        }
        catch(e) {
            console.log(e)
        }
    }
    
    async function fetchSubredditPostMetaData() {
        let data = []
        try {
            const docSnap = await getDoc(doc(db, 'subreddits', id, 'posts', post))
            setPostMetaData(docSnap.data())
            setLoading(false)
        }
        catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!props.setSubredditMetaData) { fetchSubredditData() }
        fetchSubredditPostMetaData()
    },[])

  return (
    <>{loading ? null :
        <div className='bg-gray-100 dark:bg-black min-h-screen'>
            <div className='flex flex-col-reverse md:flex-row justify-center py-4 gap-4'>
                <ul className='flex flex-col lg:w-[40rem] md:w-[30rem] dark:bg-gray-900 px-4 py-4'>
                <section className='dark:text-white'>
                    <span className='flex gap-2 items-center'>
                        <p className='font-bold text-sm'>r/{props.subredditMetaData.title}</p>
                        <p className='text-xs opacity-50'>Posted by u/{postMetaData.author} {getDatefromSeconds(postMetaData.timestamp?.seconds, Timestamp.now().seconds)}</p>
                    </span>
                    <h1 className='mt-4 text-2xl'>{postMetaData.postTitle}</h1>
                    <p className='mt-4 text-sm'>{postMetaData.text}</p>
                </section>
                </ul>
                <ul className='flex flex-col gap-4 lg:w-[20rem] md:w-[15rem]'>
                    <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                        <h2 className='text-xl font-semibold'>About Community</h2>
                        <p>{props.subredditMetaData.aboutCommunity}</p>
                        <p className='font-semibold'>0 members</p>
                    </li>
                    <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                        <h2 className='text-xl font-semibold'>Subreddit Rules</h2>
                        <ol className='flex flex-col px-4 gap-4 list-decimal'>
                        {props.subredditMetaData.subredditRules.map((rule, index) => <li key={index}>{rule}</li>)}
                        </ol>
                    </li>
                </ul>
            </div>
        </div>}
        </>
  )
}

export default Comments