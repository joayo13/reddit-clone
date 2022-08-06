import { useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import Subreddit from "../pages/Subreddit";
import LogIn from "./LogIn";
import Navbar from "./Navbar";
import SignUp from "./SignUp";


function App() {
  const [logInPopUp, setLogInPopUp] = useState(false)
  const [signUpPopUp, setSignUpPopUp] = useState(false)
  localStorage.theme = 'light'
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  return (
    <>
    <AuthProvider>
    <Navbar setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}/>
    {logInPopUp ? <LogIn setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></LogIn> : null}
    {signUpPopUp ? <SignUp setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></SignUp> : null}
    <Subreddit/>
    </AuthProvider>
    </>
  );
}

export default App;
