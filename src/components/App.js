import { useState } from "react";
import LogIn from "./LogIn";
import Navbar from "./Navbar";


function App() {
  const [logInPopUp, setLogInPopUp] = useState(false)
  const [signUpPopUp, setSignUpPopUp] = useState(false)
  return (
    <>
    <Navbar/>
    <LogIn/>
    </>
  );
}

export default App;
