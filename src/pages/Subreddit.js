import { React, useEffect, useState, useRef }from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getDatefromSeconds } from '../helpers/getDate'
import { useParams} from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, getDocs, setDoc, collection, Timestamp, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import ListPosts from '../components/ListPosts'
import CreatePostCard from '../components/CreatePostCard'

function Subreddit(props) {

    const {currentUser, userInfo} = useAuth()
    const [subredditPostsData, setSubredditPostsData] = useState([])
    const [subredditMetaData, setSubredditMetaData] = useState({})
    const [loading, setLoading] = useState(true)
    let { id } = useParams()

    useEffect(() => {
        async function fetchSubredditData() {
            try {
                const docSnap = await getDoc(doc(db, 'subreddits', id))
                if(docSnap.exists()) {
                    setSubredditMetaData(docSnap.data())
                }
            }
            catch(e) {
                console.log(e)
            }
        }
        fetchSubredditData()

        async function fetchSubredditPosts() {
            let data = []
            try {
                const querySnapshot = await getDocs(collection(db, 'subreddits', id, 'posts'))
                querySnapshot.forEach( async (post) => {
                    data.push({...post.data()})    
                })   
                if(data.length === querySnapshot.size) {
                    setSubredditPostsData(data)
                    setLoading(false)
                }
            }    
            catch(e) {
                console.log(e)
            }
        }
        fetchSubredditPosts()
    },[id])

  return (
    <>{loading ? null :
        <div className='bg-gray-100 dark:bg-black min-h-screen'>
            <section className='flex flex-col items-center md:flex-row md:justify-center gap-4 bg-white dark:bg-gray-900 dark:text-white py-2'>
                <div style={subredditMetaData.communityColor ? {backgroundColor: subredditMetaData.communityColor} : {backgroundColor: 'black'}} className='w-20 h-20 text-white rounded-full border border-gray-200 dark:border-gray-800 text-center text-7xl'>r/</div>
                <h1 className='font-bold text-3xl text-center'>{subredditMetaData.title}</h1>
                <button className=' border border-gray-800 text-gray-800 w-24 py-1 rounded-full dark:text-white dark:border-white'>Join</button>
            </section>
            <div className='flex flex-col-reverse md:flex-row justify-center mt-4 gap-4'>
                <ul className='flex flex-col gap-4 lg:w-[40rem] md:w-[30rem]'>
                    {currentUser ? <CreatePostCard userInfo={userInfo} id={id}/> : null}
                    <ListPosts subredditPostsData={subredditPostsData} id={id}/>
                </ul>
                <ul className='flex flex-col gap-4 lg:w-[20rem] md:w-[15rem]'>
                    <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                        <h2 className='text-xl font-semibold'>About Community</h2>
                        <p>{subredditMetaData.aboutCommunity}</p>
                        <p className='font-semibold'>0 members</p>
                    </li>
                    <li className='flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-300 gap-4 rounded-sm'>
                        <h2 className='text-xl font-semibold'>Subreddit Rules</h2>
                        <ol className='flex flex-col px-4 gap-4 list-decimal'>
                        {subredditMetaData.subredditRules?.map((rule, index) => <li key={index}>{rule}</li>)}
                        </ol>
                    </li>
                </ul>
            </div>
        </div>}
        </>
  )
}

export default Subreddit