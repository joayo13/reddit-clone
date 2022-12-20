/* eslint-disable react/prop-types */
import { arrayRemove, doc, Timestamp, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { getDatefromSeconds } from '../helpers/getDate'

function Notifications (props) {
  function randomNoNotificationMessage () {
    const messages = ['Alone again', 'Nothing yet...', '0 Notifications', 'It\'s lonely up here.']
    return messages[Math.floor(Math.random() * 4)]
  }
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  async function deleteNotification (notification) {
    await updateDoc(doc(db, 'notifications', currentUser.displayName), {
      notifications: arrayRemove(notification)
    })
    props.setNotifications(prev => prev.filter((x) => x !== notification))
  }
  return (
    <ul className='mobileNav w-80 flex flex-col absolute max-h-96 overflow-scroll right-4 bg-white dark:bg-gray-900 dark:text-white rounded-md z-10 border border-gray-200 dark:border-gray-700 text-sm font-medium '>
    <h1 className='bg-blue-200 dark:bg-gray-800 py-4 px-4'>Notifications</h1>
    {props.notifications.length === 0
      ? <h2 className='py-4 px-4 text-lg'>{randomNoNotificationMessage()} &#128546;</h2>
      : null }
    {props.notifications.sort((a, b) => b.timestamp - a.timestamp).map((notification, index) =>
    <li className='py-6 px-4 dark:hover:bg-gray-700 hover:bg-blue-50 relative cursor-pointer' key={index}>
       <svg onClick={() => deleteNotification(notification)} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-2 top-2 opacity-50 dark:text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      <div onClick={() => navigate(notification.link)} >
      <span className='flex gap-2 mb-2'>
      <h2 className='font-bold'>{notification.sender}</h2>
      <h2 className='opacity-50'>{getDatefromSeconds(notification.timestamp, Timestamp.now().seconds)}</h2>
      </span>
      <h3>{notification.message}</h3>
      </div>
    </li>)}
    </ul>
  )
}

export default Notifications
