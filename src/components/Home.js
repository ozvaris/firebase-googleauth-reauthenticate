import React, { useState, useEffect, useRef, useContext } from "react";

import { logout } from "../service/firebase";
import AuthContext from "../store/auth-context";

import "../App.css";

const Home = ({ user, usernum }) => {
  const authCtx = useContext(AuthContext);
  const openlogs = false;

  useEffect(() => {
    if (openlogs) {
      console.log("Home.js useEffect");
      console.log("Home.js user1", authCtx.token1?.displayName);
      console.log("Home.js user2", authCtx.token2?.displayName);
    }
  }, []);

  return (
    <div className="home" style={{ marginBottom: "10px" }}>
      <h1>
        Hello, <span></span>
        {user.displayName}
      </h1>
      <img src={user.photoURL} alt="" />
      <br />
      <br />
      <button
        className="button signout"
        onClick={() => {
          // console.log("Home.js signout usernum", usernum);
          // if (usernum === "1") {
          //   console.log("Home.js logout1");
          //   authCtx.logout1();
          // }
          // if (usernum === "2") {
          //   console.log("Home.js logout2");
          //   authCtx.logout2();
          // }
          logout();
        }}
      >
        {"Sign out"}
      </button>
    </div>
  );
};

export default Home;
