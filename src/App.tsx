import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { signOut } from "firebase/auth";
import "./App.css";
import { ui, auth } from "./Auth";

function App() {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      signInFlow: "popup",
      callbacks: {
        signInSuccessWithAuthResult: (authResult: any) => {
          console.log("Auth: ", authResult);
          setUser(authResult.user);
          return false;
        },
      },
    });
  }, []);

  const logout = () => {
    setUser(undefined);
    signOut(auth)
      .then(() => console.log("User signed out"))
      .catch((e) => console.log("Failed to sign out: ", e));
    window.location.reload();
  };

  return (
    <>
      <h2>Vite + React + Ts + FirebaseAuth</h2>
      {user ? (
        <div>
          <div>
            Hello <strong>{user?.displayName}</strong>
          </div>
          <div>
            <img src={user.photoURL}></img>
          </div>
          <div>
            {user.emailVerified ? "Email verified" : "Email not verified"}
          </div>
          <button onClick={logout}>Sign out</button>
        </div>
      ) : (
        <div id="firebaseui-auth-container"></div>
      )}
    </>
  );
}

export default App;
