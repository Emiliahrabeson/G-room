import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./register.css";

const Register = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [role, setRole] = useState("enseignant");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:3000/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          role,
          password,
          confirm_password,
        }),
      });

      console.log(
        "stringify : ",
        JSON.stringify({
          nom,
          prenom,
          email,
          role,
          password,
          confirm_password,
        }),
      );

      const data = await res.json();
      if (res.ok) {
        navigate("/login");
      }
      console.log("res.json : ", data);

      if (!res.ok) {
        // setError(data.message || "erreuur");
        setError(data.error || " erreuur");
        return;
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="login-cadre">
        <h2>S'inscrire</h2>
        <div className="app-name">
          <p>G-room</p>
          <p>Réservation de salles</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="votre prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="role-select">Votre rôle :</label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="enseignant">enseignant</option>
            <option value="association">association</option>
            <option value="logistique">logistique</option>
            <option value="admin">admin</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmer votre mdp"
            value={confirm_password}
            onChange={(e) => setConfirm_password(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          <h2>Créer un compte</h2>
          <button type="submit">S'inscrire</button>

          <div className="change-form">
            <p>Avez-vous déjà un compte ?</p>

            <Link to="/login">Se connecter</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
