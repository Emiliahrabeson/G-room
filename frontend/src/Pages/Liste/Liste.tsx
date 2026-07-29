import { useState, useEffect } from "react";
import "./liste.css";

interface Salle {
  nom: string;
  capacite: string;
  equipements: string;
  etat: "ok" | "busy" | "maintenance";
  etatLabel: string;
  disponibilite: string;
}

const filtres = [
  "Toutes",
  "Capacité 20+",
  "Capacité 50+",
  "Vidéoprojecteur",
  "Wi-Fi",
  "Sonorisation",
];

const Liste = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search_term, setSearch_term] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");

  useEffect(() => {
    const fetchSalles = async () => {
      const url = "http://localhost:3000/api/salles/detaillees";
      try {
        const res = await fetch(url, {
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
      } catch (err) {
        setError("Impossible de contacter le serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchSalles();
  }, []);

  const salles_filtrees = salles.filter((salle) =>
    salle.nom.toLowerCase().includes(search_term.toLowerCase()),
  );

  return (
    <>
      <div className="title_bar">
        <h1>Liste des salles</h1>
        <p>Liste de toutes les salles</p>

        <div className="avatar">RH</div>
      </div>

      <div className="filtre">
        <form method="POST" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="rechercher une salle"
            value={search_term}
            onChange={(e) => setSearch_term(e.target.value)}
          />
          <button type="submit">Recherche</button>
        </form>
        <div className="filtre-button">
          {filtres.map((filtre) => (
            <button
              key={filtre}
              className={activeFilter === filtre ? "active" : ""}
              onClick={() => setActiveFilter(filtre)}
            >
              {filtre}
            </button>
          ))}
        </div>
      </div>

      <div className="content">
        <h2>Salles</h2>

        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Salle</th>
                <th>Capacité</th>
                <th>Équipements</th>
                <th>État</th>
                <th>Disponibilité</th>
              </tr>
            </thead>
            <tbody>
              {salles_filtrees.map((salle) => (
                <tr key={salle.nom}>
                  <td>{salle.nom}</td>
                  <td>{salle.capacite}</td>
                  <td>{salle.equipements}</td>
                  <td>
                    <span className={`badge badge-${salle.etat}`}>
                      {salle.etatLabel}
                    </span>
                  </td>
                  <td>{salle.disponibilite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Liste;
