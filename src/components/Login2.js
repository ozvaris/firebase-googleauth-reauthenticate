import React, { useState, useEffect, useRef, useContext } from "react";
import {
  signInWithGoogle,
  signInWithAuthCredential,
  reauthenticate,
  reauthenticate2,
} from "../service/firebase";
import AuthContext from "../store/auth-context";

import "../App.css";

const Login = (props) => {
  const [token, setToken] = useState("");
  const authCtx = useContext(AuthContext);
  const txtToken = useRef();

  const openlogs = false;

  useEffect(() => {
    if (openlogs) {
      console.log("Login.js useEffect user" + props.usernum);
      console.log("Login.js  user1 displayName", authCtx.token1?.displayName);
      console.log("Login.js  user2 displayName", authCtx.token2?.displayName);
    }
  }, []);

  function handleChange(event) {
    // console.log(event.target.value);
    setToken(txtToken.current.value);
  }

  return (
    <div>
      <button
        className="button"
        onClick={async () => {
          const googleUser = await reauthenticate(
            authCtx.token1,
            localStorage.getItem("idToken" + props.usernum)
          );

          reauthenticate2(googleUser.credential);
        }}
      >
        <i className="fab fa-google"></i>
        {localStorage.getItem("displayName" + props.usernum)
          ? "Reauthenticate in with ( " +
            localStorage.getItem("displayName" + props.usernum) +
            " )"
          : "No Reauthenticate User Exist"}
      </button>
      {/* <div className="app">
        <input
          type="text"
          id="txtToken"
          minLength="7"
          onChange={handleChange}
          value={token}
          ref={txtToken}
        />
        <span>Token {token} </span>
      </div> */}
    </div>
  );
};

export default Login;
