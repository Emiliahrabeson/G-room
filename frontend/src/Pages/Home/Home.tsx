import { useState, useEffect } from "react";
import "./home.css";

const Home = () => {
  const [demande, setDemande] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDemande = async () => {
      const url =
        "http://localhost:3000/api/reservations/reservation_confirmees";
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        console.log("res.demande:", data);
        if (!res.ok) {
          setError(data.error || "erreur de chargement des demandes");
          return;
        }

        setDemande(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDemande();
  }, []);

  return (
    <>
      <div className="title_bar">
        <h1>Tableau de bord</h1>
        <p>Liste de toutes les reservations</p>

        <div className="avatar">
          {(localStorage.getItem("prenom")?.[0] ?? "") +
            (localStorage.getItem("nom")?.[0] ?? "")}
        </div>
      </div>

      <div className="content">
        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Salle</th>
                <th>Date / Horaire</th>
                <th>objet</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {demande.map((d) => (
                <tr key={d.nom_salle}>
                  <td>{d.nom_salle}</td>
                  <td>{d.date_horaire}</td>
                  <td>{d.motif}</td>
                  <td>{d.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Home;
