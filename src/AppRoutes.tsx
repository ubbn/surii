import { useMemo } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { getAuthenticationData } from "./common/storage";
import Login from "./components/auth/login";
import Home from "./components/home";
import Ilearn from "./components/neuron";

const ProtectedRoute = () => {
  // Had to read directly from localstorage
  // reading from redux was already late and routes to login even when logged in
  const isAuthenticated = useMemo(() => {
    const auth = getAuthenticationData();
    return !!auth?.user?.email;
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/learn" element={<Ilearn />} />
          <Route path="/stats" element={<>comming soon...</>} />
        </Route>
        <Route path="*" element={<>Not found</>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
