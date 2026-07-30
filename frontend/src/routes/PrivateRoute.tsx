import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
