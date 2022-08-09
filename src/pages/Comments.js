import { React, useEffect, useState, useRef }from 'react'
import redditIcon from '../images/reddit-icon.png'
import { useAuth } from '../contexts/AuthContext'
import { getDatefromSeconds } from '../helpers/getDate'
import { useParams, useNavigate} from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, getDocs, setDoc, collection, Timestamp } from "firebase/firestore";

function Comments(props) {

    const {currentUser, userInfo} = useAuth()
    const [subredditMetaData, setSubredditMetaData] = useState({})
    const [subredditPostsData, setSubredditPostsData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
 
    let { id, post } = useParams()

    
    async function fetchSubredditPostMetaData() {
        let data = []
        try {
            const docSnap = await getDoc(doc(db, 'subreddits', id, 'posts', post))
            console.log(docSnap.data())
            setLoading(false)
        }
        catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchSubredditPostMetaData()
    },[])

  return (
    <>
    </>
  )
}

export default Comments