import { useEffect } from "react";
import AppRoutes from "./Routes";
import Toolbar from "./components/layout/toolbar";
import { signIn } from "./redux/authSlice";
import { useAppDispatch } from "./redux/store";
import { getAuth } from "./common/storage";
import Body from "./components/layout/body";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authResponse = getAuth();
    dispatch(signIn(authResponse));
  }, []);

  return (
    <>
      <Toolbar />
      <Body>
        <AppRoutes />
      </Body>
    </>
  );
}

export default App;
