import { useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import Subreddit from "../pages/Subreddit";
import LogIn from "./LogIn";
import Navbar from "./Navbar";
import SignUp from "./SignUp";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from "../pages/Home";

function App() {
  const [logInPopUp, setLogInPopUp] = useState(false)
  const [signUpPopUp, setSignUpPopUp] = useState(false)
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  return (
    <>
    <Router>
    <AuthProvider>
    <Navbar setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}/>
    {logInPopUp ? <LogIn setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></LogIn> : null}
    {signUpPopUp ? <SignUp setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></SignUp> : null}
    <Routes>
    <Route exact path='/' element={<Home/>}/>
    <Route exact path='/r/:id' element={<Subreddit/>}/>
    </Routes>
    </AuthProvider>
    </Router>
    </>
  );
}

export default App;
