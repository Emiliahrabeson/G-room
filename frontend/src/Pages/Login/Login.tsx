import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = "http://localhost:3000/api/auth/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("stringify", JSON.stringify({ email, password }));

      const data = await res.json();
      console.log("res.json:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        navigate("/home");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="login-cadre">
        <h2>Se connecter</h2>
        <div className="app-name">
          <p>G-room</p>
          <p>Réservation de salles</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Se connecter</button>

          <div className="change-form">
            <p>Pas de compte ?</p>

            <Link to="/register">S'inscrire</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
