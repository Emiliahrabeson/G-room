import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Liste from "./Pages/Liste/Liste.tsx";
import Demande from "./Pages/Demande/Demande.tsx";
import Planning from "./Pages/Planning/Planning.tsx";
import Gestion from "./Pages/Gestion/Gestion.tsx";
import Reservation from "./Pages/Reservation/Reservation.tsx";
import Layout from "./Components/Layout/Layout";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/liste" element={<Liste />} />
            <Route path="/demande" element={<Demande />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/gestion" element={<Gestion />} />
            <Route path="/reservation" element={<Reservation />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
