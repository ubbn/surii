import { useSelector } from "react-redux";
import "./App.css";
import Login from "./components/auth/login";
import Logout from "./components/auth/logout";
import { RootState } from "./redux/store";

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return <>{isAuthenticated ? <Logout /> : <Login />}</>;
}

export default App;
