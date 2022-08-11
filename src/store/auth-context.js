import React, { useState, useEffect, useCallback, useMemo } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token1: "",
  token2: "",
  isLoggedIn1: false,
  isLoggedIn2: false,
  login1: (token, expiresIn) => {},
  logout1: () => {},
  login2: (token, expiresIn) => {},
  logout2: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;
  // console.log("calculateRemainingTime expirationTime=", expirationTime);
  // console.log("calculateRemainingTime remainingDuration=", remainingDuration);

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken1 = localStorage.getItem("token1");
  const storedExpirationDate1 = localStorage.getItem("expirationTime1");

  let initialTokenData1 = { token: null, duration: null };
  let initialTokenData2 = { token: null, duration: null };

  const remainingTime1 = calculateRemainingTime(storedExpirationDate1);

  if (remainingTime1 <= 3600) {
    // console.log("retrieveStoredToken remainingTime1 <= 3600");
    localStorage.removeItem("token1");
    localStorage.removeItem("idToken1");
    localStorage.removeItem("expirationTime1");
    // return null;
  } else {
    // console.log("retrieveStoredToken initialTokenData1 set ");
    initialTokenData1 = { token: storedToken1, duration: remainingTime1 };
  }

  const storedToken2 = localStorage.getItem("token2");
  const storedExpirationDate2 = localStorage.getItem("expirationTime2");

  const remainingTime2 = calculateRemainingTime(storedExpirationDate2);

  if (remainingTime2 <= 3600) {
    // console.log("retrieveStoredToken remainingTime2 <= 3600");
    localStorage.removeItem("token2");
    localStorage.removeItem("idToken2");
    localStorage.removeItem("expirationTime2");
    // return null;
  } else {
    // console.log("retrieveStoredToken initialTokenData2 set ");
    initialTokenData2 = { token: storedToken2, duration: remainingTime2 };
  }

  return {
    initialTokenData1,
    initialTokenData2,
  };
};

export const AuthContextProvider = (props) => {
  const { initialTokenData1, initialTokenData2 } = retrieveStoredToken();

  let initialToken1;
  if (initialTokenData1) {
    initialToken1 = initialTokenData1.token;
  }

  let initialToken2;
  if (initialTokenData2) {
    initialToken1 = initialTokenData2.token;
  }

  const [token1, setToken1] = useState(initialToken1);
  const [token2, setToken2] = useState(initialToken2);

  const userIsLoggedIn1 = !!token1;
  const userIsLoggedIn2 = !!token2;

  const logoutHandler1 = useCallback(() => {
    console.log("logoutHandler1");
    setToken1(null);
    localStorage.removeItem("token1");
    localStorage.removeItem("expirationTime1");
    localStorage.removeItem("idToken1");
    localStorage.removeItem("displayName1");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler1 = (token, expirationTime) => {
    console.log("loginHandler1");
    setToken1(token);
    localStorage.setItem("token1", token);
    localStorage.setItem("expirationTime1", expirationTime);
    localStorage.setItem("displayName1", token.displayName);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler1, remainingTime);
  };

  const logoutHandler2 = useCallback(() => {
    console.log("logoutHandler2");
    setToken2(null);
    localStorage.removeItem("token2");
    localStorage.removeItem("expirationTime2");
    localStorage.removeItem("idToken2");
    localStorage.removeItem("displayName2");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler2 = (token, expirationTime) => {
    console.log("loginHandler2");
    setToken2(token);
    localStorage.setItem("token2", token);
    localStorage.setItem("expirationTime2", expirationTime);
    localStorage.setItem("displayName2", token.displayName);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler1, remainingTime);
  };

  useEffect(() => {
    const openlogs = false;

    if (initialTokenData1.token) {
      openlogs && console.log("auth-context.js useEffect");
      openlogs &&
        console.log(
          "initialTokenData1.token =",
          initialTokenData1.token?.displayName
        );
      openlogs &&
        console.log("initialTokenData1.duration =", initialTokenData1.duration);
      logoutTimer = setTimeout(logoutHandler1, initialTokenData1.duration);
    }

    if (initialTokenData2.token) {
      openlogs && console.log("auth-context.js useEffect");
      openlogs &&
        console.log(
          "initialTokenData2.token =",
          initialTokenData2.token?.displayName
        );
      openlogs &&
        console.log("initialTokenData2.duration =", initialTokenData2.duration);
      logoutTimer = setTimeout(logoutHandler1, initialTokenData2.duration);
    }
  }, []);

  const contextValue = {
    token1: token1,
    isLoggedIn1: userIsLoggedIn1,
    token2: token2,
    isLoggedIn2: userIsLoggedIn2,
    login1: loginHandler1,
    logout1: logoutHandler1,
    login2: loginHandler2,
    logout2: logoutHandler2,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
