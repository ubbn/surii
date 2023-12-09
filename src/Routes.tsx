import { ReactElement, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth } from "./common/storage";
import Login from "./components/auth/login";
import Home from "./components/home";
import Ilearn from "./components/neuron";
import { signIn } from "./redux/authSlice";
import { useAppDispatch } from "./redux/store";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    const authResponse = getAuth();
    console.log(":", authResponse?.user?.email, !!authResponse?.user);
    setAuth(!!authResponse?.user);
    dispatch(signIn(authResponse));
    if (!authResponse?.user) {
      navigate("/dama");
    }
  }, []);

  useEffect(() => {
    console.log("effect on auth: ", auth);
  }, [auth]);

  console.log("Why: ", auth);

  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <Ilearn />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
