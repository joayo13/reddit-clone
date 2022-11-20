/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import { AuthProvider } from '../contexts/AuthContext'
import Subreddit from '../pages/Subreddit'
import LogIn from './LogIn'
import Navbar from './Navbar'
import SignUp from './SignUp'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Home from '../pages/Home'
import SubmitPost from '../pages/SubmitPost'
import CreateCommunity from './CreateCommunity'
import Comments from '../pages/Comments'

function App () {
  const [logInPopUp, setLogInPopUp] = useState(false)
  const [signUpPopUp, setSignUpPopUp] = useState(false)
  const [createCommunityPopUp, setCreateCommunityPopUp] = useState(false)
  return (
    <>
    <Router>
    <AuthProvider>
    <Navbar setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp} setCreateCommunityPopUp={setCreateCommunityPopUp}/>
    {logInPopUp ? <LogIn setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></LogIn> : null}
    {signUpPopUp ? <SignUp setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></SignUp> : null}
    {createCommunityPopUp ? <CreateCommunity setCreateCommunityPopUp={setCreateCommunityPopUp}></CreateCommunity> : null}
    <Routes>
    <Route exact path='/' element={<Home setSignUpPopUp={setSignUpPopUp}/>}/>
    <Route exact path='/r/:id' element={<Subreddit/>}/>
    <Route exact path ='/r/:id/submit' element={<SubmitPost/>}/>
    <Route exact path ='/r/:id/comments/:post' element={<Comments/>}/>
    </Routes>
    </AuthProvider>
    </Router>
    </>
  )
}

export default App
