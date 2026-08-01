import { useState, useEffect } from "react";
import "./planning.css";

interface Salle {
  id_salle: number;
  nom: string;
}

interface LignePlanning {
  horaire: string;
  jours: Record<string, string | null>;
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const Planning = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [salleSelectionnee, setSalleSelectionnee] = useState<number | null>(
    null,
  );
  const [semaine, setSemaine] = useState("");
  const [planning, setPlanning] = useState<LignePlanning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger la liste des salles une seule fois, au montage
  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/salles/liste", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erreur lors du chargement des salles");
          return;
        }

        setSalles(data);

        if (data.length > 0) {
          setSalleSelectionnee(data[0].id_salle);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSalles();
  }, []);

  // Recharger le planning à chaque changement de salle sélectionnée
  useEffect(() => {
    if (salleSelectionnee === null) return;

    const fetchPlanning = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://localhost:3000/api/planning?id_salle=${salleSelectionnee}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erreur lors du chargement du planning");
          return;
        }

        setSemaine(data.semaine);
        setPlanning(data.planning);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanning();
  }, [salleSelectionnee]);

  return (
    <>
      <div className="title_bar">
        <h1>Planning</h1>
        <p>Plan de l'occupation des salles</p>

        <div className="avatar">RH</div>
      </div>

      <div className="content">
        <div className="planning-header">
          <select
            value={salleSelectionnee ?? ""}
            onChange={(e) => setSalleSelectionnee(Number(e.target.value))}
          >
            {salles.map((salle) => (
              <option key={salle.id_salle} value={salle.id_salle}>
                {salle.nom}
              </option>
            ))}
          </select>

          <span>{semaine}</span>
        </div>

        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <table className="planning-table">
            <thead>
              <tr>
                <th>Horaire</th>
                {JOURS.map((jour) => (
                  <th key={jour}>{jour}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planning.map((ligne) => (
                <tr key={ligne.horaire}>
                  <td>{ligne.horaire}</td>
                  {JOURS.map((jour) => (
                    <td
                      key={jour}
                      className={ligne.jours[jour] ? "reserved" : ""}
                    >
                      {ligne.jours[jour] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Planning;
