/* eslint-disable react/prop-types */
import React from 'react'
import { useNavigate } from 'react-router-dom'

function CreatePostCard (props) {
  const navigate = useNavigate()
  const { userInfo, id } = props
  return (
    <div>
        <li className='flex gap-2 px-4 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 md:rounded-md'>
            <img src={userInfo.profilePicture} className='w-10 rounded-full'></img>
             <input type='text' onClick={() => navigate(`/r/${id}/submit`)} placeholder='Create Post' className='w-full outline-none bg-gray-100 dark:bg-gray-800 dark:text-white indent-2 rounded-md dark:border-gray-800 border border-gray-200'></input>
        </li>
    </div>
  )
}

export default CreatePostCard
