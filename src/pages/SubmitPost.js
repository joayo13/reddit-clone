import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import { createPost, fetchSubredditData } from '../helpers/getSubredditDataFunctions'
import { deleteImage, uploadImage } from '../helpers/uploadImageFunctions'

function SubmitPost () {
  const { userInfo } = useAuth()
  const [subredditMetaData, setSubredditMetaData] = useState({})
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [fileSelected, setFileSelected] = useState(null)
  const [imageURL, setImageURL] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const { id } = useParams()
  const postTitleRef = useRef()
  const postTextRef = useRef()
  const navigate = useNavigate()
  useEffect(() => {
    fetchSubredditData(setSubredditMetaData, setLoading, id)
  }, [id])
  return (
    <>{loading
      ? null
      : <div className='bg-gray-200 dark:bg-black min-h-screen'>
                <div className='flex flex-col-reverse md:flex-row bg-white dark:bg-gray-900 md:bg-inherit dark:md:bg-inherit justify-center py-4 gap-4'>
                  <div className='flex flex-col justify-between h-72'>
                  <h1 className='dark:text-white text-black indent-4 md:indent-0 text-md md:mb-4'>Create a post in r/{subredditMetaData.title}</h1>
                    <ul className='flex flex-col md:border lg:w-[40rem] md:w-[30rem] w-full px-4 py-4 bg-white dark:bg-gray-900 md:dark:border-gray-800 md:border-gray-300 md:rounded-md'>
                        <li className='py-2'>
                            <input type='text' ref={postTitleRef} placeholder='Title' maxLength={100} className='w-full py-1 bg-gray-100 dark:bg-gray-800 dark:text-white indent-2 rounded-md dark:border-gray-800 border border-gray-200'></input>
                        </li>
                        <li className= 'py-2'>
                            <div className='relative'>
                              {imageURL
                                ? <button onClick={() => deleteImage(fileSelected, setImageURL)} className='absolute -top-4 -right-4'>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="grey" viewBox="0 0 24 24" strokeWidth="0.7" stroke="white" className="w-14 h-14">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                                : null }
                            <img src={imageURL} className='pb-4 mx-auto'></img>
                            </div>
                            {imageLoading
                              ? <div role="status">
                                <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-[#ff4500] m-8 mx-auto" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                                </div>
                              : null}
                            <textarea ref={postTextRef} placeholder='Text(optional)' className='w-full py-1 bg-gray-100 dark:bg-gray-800 dark:text-white indent-2 rounded-md dark:border-gray-800 border border-gray-200 h-28'>
                            </textarea>
                            <div className='relative dark:text-white py-4 mt-4'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute opacity-50 left-0 w-8 h-8 bottom-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <input type="file" className='w-8 bottom-0 absolute opacity-0' onChange={(file) => { setFileSelected(file.target.files[0]); uploadImage(file.target.files[0], setImageURL, setImageLoading) }}></input>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute p-[0.15rem] opacity-50 left-10 w-8 h-8 bottom-0">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                            <button onClick={() => createPost(id, postTitleRef, userInfo, postTextRef, navigate, imageURL)} className='bg-blue-500 text-white w-20 py-1 rounded-full font-semibold absolute bottom-0 right-0'>Post</button>
                            </div>
                        </li>
                    </ul>
                    </div>
                    <ul className='flex flex-col md:gap-4 lg:w-[20rem] md:w-[15rem]'>
                    <li className= 'hidden md:flex py-4 px-4 flex-col bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 dark:text-gray-300 gap-4 md:rounded-md overflow-hidden'>
                        <h2 className='text-md dark:text-white font-semibold'>About Community</h2>
                        <div className='flex gap-2 items-center'>
                          <div className='w-16 h-16 rounded-full text-4xl flex items-center justify-center' style={{ backgroundColor: subredditMetaData.communityColor }}>
                            <p className='text-white'>r/</p>
                          </div>
                          <div className='flex flex-col'>
                          <h1 className='text-2xl'>r/{subredditMetaData.title}</h1>
                          <p className='text-sm opacity-50'>Created {subredditMetaData.birthday}</p>
                          </div>
                        </div>
                        <p className='text-sm'>{subredditMetaData.aboutCommunity}</p>
                        <p className='font-semibold text-sm'>{subredditMetaData.joined} Members</p>
                        <button className='py-1 w-full mb-4 mx-auto bg-blue-500 font-bold rounded-full text-white hover:bg-blue-400 text-sm'>Follow</button>
                    </li>
                    <li className='flex flex-col bg-white px-4 py-4 dark:bg-gray-900 md:border border-gray-300 dark:border-gray-800 dark:text-gray-300 gap-4 md:rounded-md overflow-hidden'>
                    <h2 className='text-xs dark:text-white text-black font-semibold'>R/{subredditMetaData.title.toUpperCase()} RULES</h2>
                        <li className='flex flex-col gap-4'>
                        {subredditMetaData.subredditRules?.map((rule, index) => <li className='text-sm font-bold' key={index}>{index + 1}. {rule}</li>)}
                        </li>
                    </li>
                </ul>
                </div>
            </div>}
        </>
  )
}

export default SubmitPost
