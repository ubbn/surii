import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AppRoutes from "./AppRoutes";
import FadingDots from "./common/FadingDots";
import { getAuthenticationData } from "./common/storage";
import { Body, Footer, Toolbar } from "./components/layout";
import { signIn } from "./redux/authSlice";
import { RootState, useAppDispatch } from "./redux/store";

type AppContextContent = {
  keyEvent?: KeyboardEvent
}

export const AppContext = createContext<AppContextContent>({});

function App() {
  const dispatch = useAppDispatch();
  const loading = useSelector((v: RootState) => v.main.loading);
  const [keyEvent, setKeyEvent] = useState<KeyboardEvent>();

  useEffect(() => {
    const authResponse = getAuthenticationData();
    dispatch(signIn(authResponse));

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onKeyDown = (keyboardEvent: KeyboardEvent) => {
    setKeyEvent(keyboardEvent);
  };

  return (
    <AppContext.Provider value={{ keyEvent }}>
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
    </AppContext.Provider>
  );
}

export default App;
