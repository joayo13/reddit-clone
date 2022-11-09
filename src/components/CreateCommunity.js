import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { useParams, useNavigate} from 'react-router-dom'
import { doc, getDoc, getDocs, addDoc, setDoc, collection, serverTimestamp} from "firebase/firestore";

function CreateCommunity(props) {
    const { userInfo } = useAuth()
    const nameRef = useRef()
    const aboutCommunityRef = useRef()
    const [subredditRules, setSubredditRules] = useState([])
    const [newRuleInput, setNewRuleInput] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const newRuleRef = useRef()
    let navigate = useNavigate()


    async function createCommunity(props) {
        try {
            await setDoc(doc(db, "subreddits", nameRef.current.value), {
                title: nameRef.current.value,
                subredditRules: subredditRules,
                aboutCommunity: aboutCommunityRef.current.value,
                admin: userInfo.username,
                communityColor: '#0079d3',
                joined: 0,
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
        <div className='relative w-screen h-screen md:absolute md:w-[30rem] md:h-[40rem] bg-white rounded-md shadow-xl overflow-scroll dark:bg-gray-900 dark:text-white px-4 py-4'>
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
            <div className='relative'>
            <h1>Subreddit Rules</h1>
            <p className='opacity-50 text-sm'>Set the rules for your Subreddit.</p>
            { newRuleInput ? null : 
            <div className='absolute flex gap-1 bottom-0 right-0'>
             <button className='flex items-center text-xs py-3 px-2 dark:text-white dark:bg-gray-700 bg-gray-300 gap-1 rounded-md' onClick={() => setNewRuleInput(true)}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 dark:text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                 Add new rule</button>
             <button onClick={() => setDeleteMode(!deleteMode)} style={deleteMode ? {backgroundColor: '#46d160'} : null} className='flex items-center text-xs py-3 px-3 dark:text-white bg-red-500 gap-1 rounded-md transition-colors'>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            </button>
            </div>
            }
            </div>
            <ol type='decimal' className=''>
            {newRuleInput ? 
            <div className='flex gap-4'>
                <li className='flex items-center h-10 w-full border border-gray-300 dark:border-gray-700 my-4 rounded-md outline-blue-500 hover:outline outline-1 focus-within:outline'>
                    <label className='mx-2 text-lg opacity-50'>{subredditRules.length + 1}.</label>
                    <input required ref={newRuleRef} type='text' maxLength={20} className='bg-inherit outline-none'></input>
                </li>
                <button
                onClick={() => { setSubredditRules(prev => prev.filter((item) => item !== newRuleRef.current.value).concat(newRuleRef.current.value));
                setNewRuleInput(false)}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#46d160" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button onClick={() => setNewRuleInput(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="#fe3a3a">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div> : null}
            <div className='flex flex-col gap-4 mt-4'>
            {subredditRules.map((rule) => 
            <div className='flex gap-2'>
                {deleteMode ? <svg onClick={() => setSubredditRules(prev => prev.filter((rules) => rules !== rule))} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="#fe3a3a">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg> : null}
                
                <li className='font-bold'>{subredditRules.indexOf(rule) + 1}. {rule}</li></div>)}
            </div>
            </ol>
            <div className='flex'>
            <button onClick={() => createCommunity()} className=' ml-auto rounded-full py-2 px-4 mt-4 bg-blue-600 text-white font-semibold'>Create Community</button>
            </div>
        </div>
    </div>
  )
}

export default CreateCommunity