// Import the functions you need from the SDKs you need
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
import firebaseConfig from "../firebase-config";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  reauthenticateWithCredential,
  signInWithCredential,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import util from "util";

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// export const auth = firebase.auth();
// const provider = new firebase.auth.GoogleAuthProvider();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

//provider.setCustomParameters({ prompt: "select_account" });

const signInWithGoogle = () => signInWithPopup(auth, provider);

const signInWithAuthCredential = async () => {
  try {
    const credentials = await signInWithPopup(auth, provider)
      .then((result) => {
        //console.log("util.inspect(result)", result._tokenResponse.idToken);
        //console.log(util.inspect(result));
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        const { user } = result;
        //const idToken = result._tokenResponse.idToken;

        //console.log("idToken", result._tokenResponse.idToken);
        console.log("idToken", idToken);
        console.log("accessToken", accessToken);
        console.log("user", user);

        //const authCredential = AuthProvider.credentialFromResult(result);

        return { user, credential, idToken, accessToken };
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code
        // const errorMessage = error.message
        // The email of the user's account used.
        // const {email} = error.customData
        // The AuthCredential type that was used.
        // const credential =
        //    GoogleAuthProvider.credentialFromError(error)
        // ...
      });

    const docRef = doc(db, "users", credentials.user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      // console.log('No such document!')
      // Add a new document in collection "cities"
      await setDoc(doc(db, "users", credentials.user.uid), {
        uid: credentials.user.uid,
        name: credentials.user.displayName,
        authProvider: "google",
        email: credentials.user.email,
      });
    }

    return credentials;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const reauthenticate = (user, idToken) => {
  console.log(idToken);
  const credential = GoogleAuthProvider.credential(idToken);
  console.log(credential.idToken);
  console.log("credintal ok");
  const googleUser = signInWithCredential(auth, credential)
    .then((result) => {
      //console.log("util.inspect(result)", result._tokenResponse.idToken);
      //console.log(util.inspect(result));
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);

      //const accessToken = credential.accessToken;

      const idToken = credential.idToken;
      //const idToken = result._tokenResponse.idToken;

      //console.log("idToken", result._tokenResponse.idToken);
      console.log("idToken---", idToken);

      //const authCredential = AuthProvider.credentialFromResult(result);

      return { credential, idToken };
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code
      // const errorMessage = error.message
      // The email of the user's account used.
      // const {email} = error.customData
      // The AuthCredential type that was used.
      // const credential =
      //    GoogleAuthProvider.credentialFromError(error)
      // ...
    });

  return googleUser;
};

const reauthenticate2 = (reauthCredintal) => {
  const googleUser = signInWithCredential(auth, reauthCredintal)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      //const accessToken = credential.accessToken;

      const idToken = credential.idToken;
      //const idToken = result._tokenResponse.idToken;

      //console.log("idToken", result._tokenResponse.idToken);
      console.log("reauthenticate2-idToken---", idToken);

      return { credential, idToken };
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code
      // const errorMessage = error.message
      // The email of the user's account used.
      // const {email} = error.customData
      // The AuthCredential type that was used.
      // const credential =
      //    GoogleAuthProvider.credentialFromError(error)
      // ...
    });

  return googleUser;
};

export {
  auth,
  db,
  signInWithGoogle,
  signInWithAuthCredential,
  logout,
  reauthenticate,
  reauthenticate2,
};
