import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { useParams, useNavigate} from 'react-router-dom'
import { doc, getDoc, getDocs, addDoc, setDoc, collection, serverTimestamp} from "firebase/firestore";

function CreateCommunity(props) {
    const { userInfo } = useAuth()
    const nameRef = useRef()
    const aboutCommunityRef = useRef()
    const ruleOneRef = useRef()
    const ruleTwoRef = useRef()
    const ruleThreeRef = useRef()
    const colorRef = useRef()
    let navigate = useNavigate()


    async function createCommunity(props) {
        try {
            await setDoc(doc(db, "subreddits", nameRef.current.value), {
                title: nameRef.current.value,
                subredditRules: [ruleOneRef.current.value, ruleTwoRef.current.value, ruleThreeRef.current.value],
                aboutCommunity: aboutCommunityRef.current.value,
                admin: userInfo.username,
                communityColor: colorRef.current.value,

            })
            .then(() => {
                navigate(`/r/${nameRef.current.value}`)
                window.location.reload()
            })
        }
        catch(e) {
            console.log(e)
        }
    }

  return (
    <div className='fixed flex w-screen h-screen justify-center items-center top-0 overflow-y-hidden z-10'>
        <div className='fixed w-screen h-screen left-0 top-0 right-0 bottom-0 bg-black opacity-50'></div>
        <div className='relative w-screen h-screen md:absolute md:w-[30rem] md:h-[45rem] bg-white rounded-md shadow-xl overflow-hidden dark:bg-gray-900 dark:text-white px-4 py-4'>
            <h1 className=''>Create a Community</h1>
            <div className='dark:bg-gray-700 bg-gray-300 w-full h-px my-4'></div>
            <svg onClick={()=> props.setCreateCommunityPopUp(false)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute right-2 top-2 opacity-50 dark:text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h1>Name</h1>
            <p className='opacity-50 text-sm'>Community names including capitalization cannot be changed.</p>
            <div className='flex items-center h-10 w-full border border-gray-300 dark:border-gray-700 my-4 rounded-md outline-blue-500 hover:outline outline-1 focus-within:outline'>
                <label className='mx-2 text-lg opacity-50'>/r</label>
                <input type='text' ref={nameRef} required maxLength={20} className='bg-inherit outline-none'></input>
            </div>
            <h1>About Community</h1>
            <p className='opacity-50 text-sm'>Give a brief description of your Community and it's intended purpose.</p>
            <textarea ref={aboutCommunityRef} required className='w-full border border-gray-300 dark:border-gray-700 h-20 my-4 indent-2 rounded-md outline-blue-500 hover:outline outline-1 focus-within:outline bg-inherit text-indent-2'></textarea>
            <h1>Subreddit Rules</h1>
            <p className='opacity-50 text-sm'>Set the rules for your Subreddit.</p>
            <ol type='decimal' className=''>
            <li className='flex items-center h-10 w-full border border-gray-300 dark:border-gray-700 my-4 rounded-md outline-blue-500 hover:outline outline-1 focus-within:outline'>
                <label className='mx-2 text-lg opacity-50'>1.</label>
                <input type='text' ref={ruleOneRef} maxLength={20} className='bg-inherit outline-none'></input>
            </li>
            <li className='flex items-center h-10 w-full border border-gray-300 dark:border-gray-700 my-4 rounded-md outline-blue-500 hover:outline outline-1 focus-within:outline'>
                <label className='mx-2 text-lg opacity-50'>2.</label>
                <input type='text' ref={ruleTwoRef} maxLength={20} className='bg-inherit outline-none'></input>
            </li>
            <li className='flex items-center h-10 w-full border border-gray-300 dark:border-gray-700 my-4 rounded-md outline-blue-500 hover:outline outline-1 focus-within:outline'>
                <label className='mx-2 text-lg opacity-50'>3.</label>
                <input type='text' ref={ruleThreeRef} maxLength={20} className='bg-inherit outline-none'></input>
            </li>
            </ol>
            <span className='flex gap-2'>
            <h1>Community Color</h1>
            <input type='color' ref={colorRef}></input>
            </span>
            <p className='opacity-50 text-sm mt-1'>This will be the color of your Community's display picture.</p>
            <button onClick={() => createCommunity()} className='rounded-full absolute py-2 px-4 bottom-2 right-2 dark:bg-gray-700 bg-blue-600 text-white font-semibold'>Create Community</button>
        </div>
    </div>
  )
}

export default CreateCommunity