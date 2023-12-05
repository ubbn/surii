import firebase from "firebase/compat/app";
import { useEffect } from "react";
import { signIn } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/store";
import { ui } from "./firebase";
import { getAuth, setAuth } from "../../common/storage";

function Login() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authResponse = getAuth();
    dispatch(signIn(authResponse));
  }, []);

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
        signInSuccessWithAuthResult: (authResponse: AuthResponse) => {
          console.log("Auth: ", authResponse);
          setAuth(authResponse);
          dispatch(signIn(authResponse));

          // Don't redirect to anything else
          return false;
        },
      },
    });
  }, []);

  return (
    <>
      <div id="firebaseui-auth-container"></div>
    </>
  );
}

export default Login;
