import "./App.css";
import { Route, Routes } from "react-router-dom";
// import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";

// import Navside from "./Components/Navside/Navside";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      {/* <Navside />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes> */}
    </>
  );
}

export default App;
