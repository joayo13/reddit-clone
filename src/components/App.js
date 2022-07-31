import { useState } from "react";
import LogIn from "./LogIn";
import Navbar from "./Navbar";
import SignUp from "./SignUp";


function App() {
  const [logInPopUp, setLogInPopUp] = useState(false)
  const [signUpPopUp, setSignUpPopUp] = useState(false)
  return (
    <>
    <Navbar setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}/>
    {logInPopUp ? <LogIn setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></LogIn> : null}
    {signUpPopUp ? <SignUp setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></SignUp> : null}
    </>
  );
}

export default App;
