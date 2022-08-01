import { useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import LogIn from "./LogIn";
import Navbar from "./Navbar";
import SignUp from "./SignUp";


function App() {
  const [logInPopUp, setLogInPopUp] = useState(false)
  const [signUpPopUp, setSignUpPopUp] = useState(false)
  return (
    <>
    <AuthProvider>
    <Navbar setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}/>
    {logInPopUp ? <LogIn setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></LogIn> : null}
    {signUpPopUp ? <SignUp setLogInPopUp={setLogInPopUp} setSignUpPopUp={setSignUpPopUp}></SignUp> : null}
    </AuthProvider>
    </>
  );
}

export default App;
