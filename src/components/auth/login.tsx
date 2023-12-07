import firebase from "firebase/compat/app";
import { useEffect } from "react";
import { setAuth } from "../../common/storage";
import { signIn } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/store";
import { ui } from "./firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

          navigate("/");
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
