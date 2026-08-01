import { useState, useEffect } from "react";
import "./demande.css";

const Demande = () => {
  const [demande, setDemande] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDemande = async () => {
      const url = "http://localhost:3000/api/reservations/demande";
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
        <h1>Les demandes de réservation de salles</h1>
        <p>Vue d'ensemble de toutes les demandes</p>

        <div className="avatar">RH</div>
      </div>

      <div className="content">
        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Demandeur</th>
                <th>Rôle</th>
                <th>Salle demandée</th>
                <th>Date / Horaire</th>
                <th>Motif</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {demande.map((d) => (
                <tr key={d.nom}>
                  <td>{d.nom}</td>
                  <td>{d.role}</td>
                  <td>{d.nom_salle}</td>
                  <td>{d.date_horaire}</td>
                  <td>{d.motif}</td>
                  <td>{d.statut}</td>
                  <td>
                    <div className="action-btn">
                      <button>A</button>
                      <button>R</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Demande;
