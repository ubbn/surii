import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/login";
import Home from "./components/home";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
