import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";

// import Navside from "./Components/Navside/Navside";
function App() {
  return (
    <>
      {/* <Navside />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
