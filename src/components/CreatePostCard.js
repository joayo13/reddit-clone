/* eslint-disable react/prop-types */
import React from 'react'
import { useNavigate } from 'react-router-dom'

function CreatePostCard (props) {
  const navigate = useNavigate()
  const { userInfo, id } = props
  return (
    <div>
        <button onClick={() => navigate(`/r/${id}/submit`)} className='flex gap-2 px-4 py-4 w-full bg-white dark:bg-neutral-900 dark:border-neutral-800 border border-neutral-300 md:rounded-md'>
            <img src={userInfo.profilePicture} className='w-10 rounded-full'></img>
             <input onClick={() => navigate(`/r/${id}/submit`)} disabled={true} type='text' placeholder='Create Post' className='w-full outline-none bg-neutral-100 dark:bg-neutral-800 dark:text-white indent-2 rounded-md dark:border-neutral-700 border border-neutral-200'></input>
        </button>
    </div>
  )
}

export default CreatePostCard
