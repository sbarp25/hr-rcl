import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const auth = localStorage.getItem("accessToken");

  // Check if the user is authenticated or not. If not, redirect to login page.
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
