import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useParams, useNavigate} from 'react-router-dom'
import { createPost, fetchSubredditData } from '../helpers/getSubredditDataFunctions';
import { getStorage, ref, uploadBytes } from "firebase/storage";




function SubmitPost() {
    const { userInfo } = useAuth()
    const [subredditMetaData, setSubredditMetaData] = useState({})
    const [loading, setLoading] = useState(true)
    const [fileSelected, setFileSelected] = useState(null)
    let { id } = useParams()
    const postTitleRef = useRef()
    const postTextRef = useRef()
    const navigate = useNavigate()
    useEffect(() => {
        fetchSubredditData(setSubredditMetaData, setLoading, id)
    },[id])
    const storage = getStorage();
    const storageRef = ref(storage, `images/${fileSelected?.name}`);
    async function upload() {
        uploadBytes(storageRef, fileSelected).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            console.log(snapshot)
        });
    }
    
  return (
    <>{loading ? null :
        <div className='bg-gray-100 dark:bg-black min-h-screen'>
                <div className='flex md:flex-row justify-center py-4 gap-4'>
                    <ul className='flex flex-col lg:w-[40rem] md:w-[30rem] w-full px-4 py-4 bg-white dark:bg-gray-900  border-gray-200 rounded-t-md'>
                    <h1 className='dark:text-white text-black mb-4'>Create a post</h1>
                        <li className='px-4 py-2'>
                            <input type='text' ref={postTitleRef} placeholder='Title' maxLength={100} className='w-full outline-none border bg-inherit dark:text-white dark:border-gray-700 indent-2 rounded-sm py-1'></input>
                        </li>
                        <li className= 'px-4 py-2'>
                            <textarea ref={postTextRef} placeholder='Text(optional)' className='w-full outline-nonedark:bg-gray-800 bg-inherit dark:border-gray-700 dark:text-white border indent-2 rounded-sm py-1 h-28'>
                            </textarea>
                            <label className='block dark:text-white opacity-50'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>

                            <input type="file" className='hidden' onChange={(file) => setFileSelected(file.target.files[0])}></input>
                            </label>
                            <button onClick={() => upload()}>Upload</button>
                            <button onClick={() => createPost( id, postTitleRef, userInfo, postTextRef, navigate)} className='bg-blue-500 text-white w-20 py-1 mt-4 rounded-full'>Post</button>
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