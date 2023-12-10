import { Button, message } from "antd";
import { signOut as logOutFirebase } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../common/storage";
import { resetAll } from "../../redux/mainSlice";
import { useAppDispatch } from "../../redux/store";
import { auth } from "./firebase";

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(resetAll());
    setAuth(undefined);
    logOutFirebase(auth)
      .then(() => message.success("You are signed out"))
      .catch((e) => console.log("Failed to log out: ", e));
    navigate("/login");
  };

  return (
    <>
      <Button onClick={logout}>Log out</Button>
    </>
  );
};

export default Logout;
