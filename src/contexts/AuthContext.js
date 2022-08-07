import React, { useContext, useEffect, useState } from 'react'
import {auth} from '../firebase'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState({})
    async function fetchUserData () {
        const docRef = doc(db, "users", currentUser.email);
    
        try {
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()) {
            setUserInfo({
              profilePicture: docSnap.data().profilePicture,
              username: docSnap.data().username
            })
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }
        catch(e) {
          console.log(e)
        }
      }
    
      useEffect(() => {
        if (currentUser)
        fetchUserData()
      },[currentUser])

      

    function signUp(email, password) {
       return auth.createUserWithEmailAndPassword(email, password)
    }
    function logIn(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }
    function logOut() {
        return auth.signOut()
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
    })
    return unsubscribe
    },[])

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
