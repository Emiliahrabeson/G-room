import { useState } from "react";

const Login = () => {
  const [signState, setSignState] = useState("Se connecter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const url =
      signState === "Se connecter" ? "/api/auth/login" : "/api/auth/register";

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

      if (!res.ok) {
        setError(data.message || "erreuur");
        return;
      }

      if (signState === "Se connecter") {
        nav("/");
      } else {
        setSignState("Se connecter");
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  };

  return (
    <>
      <div className="login-cadre">
        <h2>{signState}</h2>
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

          <button type="submit">{signState}</button>

          <div className="change-form">
            {signState === "Se connecter" ? (
              <>
                <p>Pas de compte?</p>
                <span onClick={() => setSignState("S'inscrire")}>
                  S'inscrire
                </span>
              </>
            ) : (
              <>
                <p>Vous avez déjà un compte?</p>
                <span onClick={() => setSignState("Se connecter")}>
                  Se connecter
                </span>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
