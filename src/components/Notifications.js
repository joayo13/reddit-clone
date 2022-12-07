
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

function Notifications () {
  const { currentUser } = useAuth()
  useEffect(() => {
    async function getNotifications () {
      console.log('fuck')
      console.log(currentUser.displayName)
      const docSnap = await getDoc(doc(db, 'notifications', currentUser.displayName))
      if (docSnap.exists()) {
        console.log(docSnap.data())
      }
    }
    getNotifications()
  }, [])
  return (
    <div>Notifications</div>
  )
}

export default Notifications
