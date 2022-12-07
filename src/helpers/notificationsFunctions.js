
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

const { currentUser } = useAuth()

export async function getNotifications (setNotifications) {
  const docSnap = await getDoc(doc(db, 'notifications', currentUser.displayName))
  if (docSnap.exists()) {
    setNotifications(docSnap.data().notifications)
  }
}
export async function getNotificationsLength (setNotificationsLength) {
  const docSnap = await getDoc(doc(db, 'notifications', currentUser.displayName))
  if (docSnap.exists()) {
    return docSnap.data().notifications.length
  }
}
