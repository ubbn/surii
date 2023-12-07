import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/login";
import Ilearn from "./components/neuron";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Ilearn />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
