/* eslint-disable react/prop-types */
/* eslint-disable import/no-duplicates */
import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const AuthContext = React.createContext()

export function useAuth () {
  return useContext(AuthContext)
}

export function AuthProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({})
  async function fetchUserData () {
    const docRef = doc(db, 'users', currentUser.uid)
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUserInfo({
          profilePicture: docSnap.data().profilePicture,
          username: docSnap.data().username,
          email: currentUser.email
        })
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if (currentUser) {
      fetchUserData()
    }
  }, [currentUser])

  async function signUp (email, password, profilePicture, usernameRef) {
    await auth.createUserWithEmailAndPassword(email, password)
    const user = await auth.currentUser
    user.updateProfile({
      displayName: usernameRef
    })
    console.log(user)
    await setDoc(doc(db, 'users', user.uid), {
      profilePicture,
      username: usernameRef,
      upvotedPosts: [],
      downvotedPosts: [],
      upvotedComments: [],
      downvotedComments: [],
      joinedSubreddits: [],
      createdPosts: []
    })
    await setDoc(doc(db, 'notifications', usernameRef), {
      link: '/',
      message: 'welcome to !reddit, click here to join a community',
      sentFrom: 'admin'
    })
  }
  function logIn (email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }
  function logOut () {
    return auth.signOut()
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signUp,
    logIn,
    logOut,
    userInfo,
    setUserInfo
  }
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
