import { useState, useEffect } from "react";
import "./demande.css";

interface Demande {
  id_reservation: number;
  nom: string;
  role: string;
  nom_salle: string;
  motif: string;
  date_horaire: string;
  statut: string;
  statut_brut: string;
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`http://localhost:3000/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Une erreur est survenue");
  }

  return data;
}

function classeBadge(statut: string) {
  if (statut === "Acceptée") return "badge-ok";
  if (statut === "Refusée") return "badge-danger";
  return "badge-warn";
}

const Demande = () => {
  const [demande, setDemande] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const chargerDemandes = async () => {
    try {
      const data = await fetchApi("/reservations/demande");
      setDemande(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDemandes();
  }, []);

  const handleDecision = async (
    id_reservation: number,
    decision: "confirmee" | "refusee",
  ) => {
    try {
      await fetchApi(`/reservations/${id_reservation}/traiter`, {
        method: "PATCH",
        body: JSON.stringify({ decision }),
      });
      chargerDemandes(); // recharge la liste pour voir le nouveau statut
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="title_bar">
        <h1>Les demandes de réservation de salles</h1>
        <p>Vue d'ensemble de toutes les demandes</p>

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
                <tr key={d.id_reservation}>
                  <td>{d.nom}</td>
                  <td>{d.role}</td>
                  <td>{d.nom_salle}</td>
                  <td>{d.date_horaire}</td>
                  <td>{d.motif}</td>
                  <td>
                    <span className={`badge ${classeBadge(d.statut)}`}>
                      {d.statut}
                    </span>
                  </td>
                  <td>
                    {d.statut_brut === "en_attente" ? (
                      <div className="action-btn">
                        <button
                          onClick={() =>
                            handleDecision(d.id_reservation, "confirmee")
                          }
                        >
                          A
                        </button>
                        <button
                          onClick={() =>
                            handleDecision(d.id_reservation, "refusee")
                          }
                        >
                          R
                        </button>
                      </div>
                    ) : (
                      <span className="hint">Traitée</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Demande;
