import { signOut as logOutFirebase } from "firebase/auth";
import { signOut } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/store";
import { auth } from "./firebase";
import { setAuth } from "../../common/storage";

function Logout() {
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(signOut());
    setAuth(undefined);
    logOutFirebase(auth)
      .then(() => console.log("User signed out"))
      .catch((e) => console.log("Failed to log out: ", e));
    window.location.reload();
  };

  return (
    <>
      <button onClick={logout}>Log out</button>
    </>
  );
}

export default Logout;
