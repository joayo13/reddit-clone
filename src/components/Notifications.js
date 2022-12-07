import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

function Notifications () {
  const [notifications, setNotifications] = useState([])
  const { currentUser } = useAuth()
  useEffect(() => {
    async function getNotifications () {
      const docSnap = await getDoc(doc(db, 'notifications', currentUser.displayName))
      if (docSnap.exists()) {
        setNotifications(docSnap.data().notifications)
      }
    }
    getNotifications()
  }, [])
  return (
    <ul className='mobileNav w-40 md:w-80 flex flex-col justify-evenly absolute right-4 overflow-hidden bg-white dark:bg-gray-900 dark:text-white rounded-md z-10 border border-gray-200 dark:border-gray-700 text-sm font-medium '>
    {notifications.map((notification, index) => <li key={index}>{notification.message}</li>)}
    </ul>
  )
}

export default Notifications
