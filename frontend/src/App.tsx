import { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { getAuthenticationData } from "./common/storage";
import { Body, Footer, Toolbar } from "./components/layout";
import { signIn } from "./redux/authSlice";
import { RootState, useAppDispatch } from "./redux/store";
import { useSelector } from "react-redux";
import FadingDots from "./common/FadingDots";

function App() {
  const dispatch = useAppDispatch();
  const loading = useSelector((v: RootState) => v.main.loading);

  useEffect(() => {
    const authResponse = getAuthenticationData();
    dispatch(signIn(authResponse));
  }, []);

  return (
    <>
      <Toolbar />
      <Body>
        <AppRoutes />
      </Body>
      <Footer />
      {loading! && (
        <FadingDots
          style={{ position: "absolute", top: "30vh", left: "50vw" }}
        />
      )}
    </>
  );
}

export default App;
