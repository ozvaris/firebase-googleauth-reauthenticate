import { useState, useEffect, useRef, useContext } from "react";

import Login from "./components/Login";
import Login2 from "./components/Login2";
import Home from "./components/Home";
import { auth } from "./service/firebase";
import AuthContext from "./store/auth-context";
import { useAuthState } from "react-firebase-hooks/auth";

import "./App.css";

function App() {
  const [userNum, setUserNum] = useState("0");
  const authCtx = useContext(AuthContext);
  const txtUserNum = useRef();

  // console.log("App.js global - google_user", user);

  function addMinutes(numOfMinutes, date = new Date()) {
    date.setTime(date.getTime() + numOfMinutes * 60 * 1000);

    return date;
  }

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }

    // if (!user) {
    //     signInWithGoogle()
    // }

    if (user) {
      console.log("Appuserlog", user);

      // const expirationTime = new Date(
      //     new Date().getTime() + 24 * 60 * 60 * 1000
      // )
      // authCtx.state.auth.login(
      //     user.uid,
      //     expirationTime.toISOString()
      // )

      // navigate(from, { replace: true })

      if (user && userNum === "1") {
        console.log("App.js useEffect login1");
        authCtx.login1(user, addMinutes(1 * 60));
      }
      if (user && userNum === "2") {
        console.log("App.js useEffect login2");
        authCtx.login2(user, addMinutes(1 * 60));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  function handleChange(event) {
    // console.log(event.target.value);
    setUserNum(txtUserNum.current.value);
  }

  return (
    <>
      {userNum === "1" && (
        <div className="app">
          {user ? (
            <Home user={user} usernum={"1"} />
          ) : (
            <>
              <Login usernum={"1"} />
              <Login2 usernum={"1"} />
            </>
          )}
        </div>
      )}

      {userNum === "2" && (
        <div className="app">
          {user ? (
            <Home user={user} usernum={"2"} />
          ) : (
            <>
              <Login usernum={"2"} />
              <Login2 usernum={"2"} />
            </>
          )}
        </div>
      )}

      <div className="app">
        <input
          type="text"
          id="txtUserNum"
          minLength="7"
          onChange={handleChange}
          value={userNum}
          ref={txtUserNum}
        />
        <span>User {userNum} selected</span>
      </div>
      {/* <div className="app">
        <span>User1</span>

        <span>{authCtx.token1}</span>
      </div>
      <div className="app">
        <span>User2</span>

        <span>{authCtx.token2}</span>
      </div> */}
    </>
  );
}

export default App;
