import firebase from "firebase/compat/app";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { setAuth } from "../../common/storage";
import { signIn } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/store";
import { ui } from "./firebase";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-top: 20px;
  width: 100%;
`;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      signInFlow: "popup",
      callbacks: {
        signInSuccessWithAuthResult: (authResponse: AuthResponse) => {
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
    <Container>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <div id="firebaseui-auth-container"></div>
    </Container>
  );
};

export default Login;
