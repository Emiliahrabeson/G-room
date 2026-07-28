import { Outlet } from "react-router-dom";
import Navside from "../Navside/Navside";

const Layout = () => {
  return (
    <>
      <Navside />
      <Outlet />
    </>
  );
};

export default Layout;
