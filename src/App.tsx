import { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { getAuthenticationData } from "./common/storage";
import { Body, Footer, Toolbar } from "./components/layout";
import { signIn } from "./redux/authSlice";
import { useAppDispatch } from "./redux/store";

function App() {
  const dispatch = useAppDispatch();

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
    </>
  );
}

export default App;
