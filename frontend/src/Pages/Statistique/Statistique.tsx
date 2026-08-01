import { useState, useEffect } from "react";
import "./statistique.css";

interface OccupationSalle {
  nom: string;
  nb_reservations: number;
}

interface Stats {
  occupationParSalle: OccupationSalle[];
  reservationsParSemaine: { semaine: number; nb: number }[];
  salleLaPlusDemandee: string;
  reservationsCeMois: number;
  tauxAnnulation: string;
  delaiMoyenValidation: string;
}

async function fetchApi(endpoint: string) {
  const res = await fetch(`http://localhost:3000/api${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Une erreur est survenue");
  }

  return data;
}

const Statistique = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const chargerStats = async () => {
      try {
        const data = await fetchApi("/statistiques");
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    chargerStats();
  }, []);

  // Trouve la valeur max pour calculer la hauteur des barres en %
  const maxOccupation = stats
    ? Math.max(...stats.occupationParSalle.map((s) => s.nb_reservations), 1)
    : 1;

  const maxSemaine = stats
    ? Math.max(...stats.reservationsParSemaine.map((s) => s.nb), 1)
    : 1;

  return (
    <div className="page">
      <div className="title_bar">
        <h1>Statistiques</h1>
        <p>Vue de taux d'occupation de chaque salle</p>

        <div className="avatar">RH</div>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-2">
            <div className="card">
              <div className="section-title">
                Réservations par salle (ce mois)
              </div>
              <div className="bar-chart">
                {stats.occupationParSalle.map((s) => (
                  <div key={s.nom} className="bar-item">
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          height: `${(s.nb_reservations / maxOccupation) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="bar-value">{s.nb_reservations}</span>
                    <span className="bar-label">{s.nom}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-title">Réservations par semaine</div>
              <div className="bar-chart">
                {stats.reservationsParSemaine.map((s) => (
                  <div key={s.semaine} className="bar-item">
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ height: `${(s.nb / maxSemaine) * 100}%` }}
                      ></div>
                    </div>
                    <span className="bar-value">{s.nb}</span>
                    <span className="bar-label">
                      S{String(s.semaine).slice(-2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-4">
            <div className="card">
              <div className="met-label">Salle la plus demandée</div>
              <div className="met-value">{stats.salleLaPlusDemandee}</div>
            </div>
            <div className="card">
              <div className="met-label">Réservations ce mois</div>
              <div className="met-value">{stats.reservationsCeMois}</div>
            </div>
            <div className="card">
              <div className="met-label">Délai moyen de validation</div>
              <div className="met-value">6h</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistique;
