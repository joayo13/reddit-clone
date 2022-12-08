/* eslint-disable react/prop-types */
import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { getDatefromSeconds } from '../helpers/getDate'

function Notifications (props) {
  return (
    <ul className='mobileNav w-80 flex flex-col justify-evenly absolute right-4 top-overflow-hidden bg-white dark:bg-gray-900 dark:text-white rounded-md z-10 border border-gray-200 dark:border-gray-700 text-sm font-medium '>
    <h1 className='py-4 px-4'>Notifications</h1>
    {props.notifications.map((notification, index) =>
    <li className='py-6 px-4 dark:bg-gray-800 dark:hover:bg-gray-700 bg-blue-100 hover:bg-blue-50 cursor-pointer' key={index}>
      <span className='flex gap-2 mb-2'>
      <h2 className='font-bold'>{notification.sender}</h2>
      <h2 className='opacity-50'>{getDatefromSeconds(notification.timestamp, Timestamp.now().seconds)}</h2>
      </span>
      <h3>{notification.message}</h3>
    </li>)}
    </ul>
  )
}

export default Notifications
