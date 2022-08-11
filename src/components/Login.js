import React, { useState, useEffect, useRef, useContext } from "react";
import {
  signInWithGoogle,
  signInWithAuthCredential,
  reauthenticate,
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
        onClick={() =>
          signInWithAuthCredential().then((credentials) => {
            localStorage.setItem(
              "idToken" + props.usernum,
              credentials.idToken
            );
          })
        }
      >
        <i className="fab fa-google"></i>
        {"Sign in with User" + props.usernum}
      </button>
    </div>
  );
};

export default Login;
