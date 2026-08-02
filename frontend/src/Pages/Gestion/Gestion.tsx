import { useState, useEffect } from "react";
import "./gestion.css";

interface Salle {
  id_salle: number;
  nom: string;
  capacite: number;
  equipements: string;
  statut: "active" | "inactive";
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

const Gestion = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Formulaire (ajout ou modification)
  const [formOuvert, setFormOuvert] = useState(false);
  const [salleEnEdition, setSalleEnEdition] = useState<Salle | null>(null);
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState("");
  const [equipements, setEquipements] = useState("");

  const chargerSalles = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi("/salles/liste");
      setSalles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerSalles();
  }, []);

  const ouvrirAjout = () => {
    setSalleEnEdition(null);
    setNom("");
    setCapacite("");
    setEquipements("");
    setFormOuvert(true);
  };

  const ouvrirEdition = (salle: Salle) => {
    setSalleEnEdition(salle);
    setNom(salle.nom);
    setCapacite(String(salle.capacite));
    setEquipements(salle.equipements);
    setFormOuvert(true);
  };

  const fermerForm = () => {
    setFormOuvert(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (salleEnEdition) {
        await fetchApi(`/salles/${salleEnEdition.id_salle}`, {
          method: "PUT",
          body: JSON.stringify({ nom, capacite, equipements }),
        });
      } else {
        await fetchApi("/salles", {
          method: "POST",
          body: JSON.stringify({ nom, capacite, equipements }),
        });
      }

      setFormOuvert(false);
      chargerSalles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSupprimer = async (id_salle: number) => {
    if (!window.confirm("Supprimer cette salle ?")) return;

    try {
      await fetchApi(`/salles/${id_salle}`, { method: "DELETE" });
      chargerSalles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangerStatut = async (salle: Salle) => {
    const nouveauStatut = salle.statut === "active" ? "inactive" : "active";

    try {
      await fetchApi(`/salles/${salle.id_salle}/statut`, {
        method: "PATCH",
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      chargerSalles();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="title_bar">
        <h1>Gestion des salles</h1>
        <p>Les salles disponibles et non disponibles</p>

        <div className="avatar">
          {(localStorage.getItem("prenom")?.[0] ?? "") +
            (localStorage.getItem("nom")?.[0] ?? "")}
        </div>
      </div>

      <div>
        <button className="btn btn-primary" onClick={ouvrirAjout}>
          + Ajouter une salle
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {formOuvert && (
        <div className="form-card">
          <h3>{salleEnEdition ? "Modifier la salle" : "Ajouter une salle"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nom de la salle"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Capacité"
              value={capacite}
              onChange={(e) => setCapacite(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Équipements (ex: Projecteur, Wi-Fi)"
              value={equipements}
              onChange={(e) => setEquipements(e.target.value)}
            />

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {salleEnEdition ? "Enregistrer" : "Ajouter"}
              </button>
              <button type="button" className="btn" onClick={fermerForm}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content">
        {loading && <p>Chargement...</p>}

        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Salle</th>
                <th>Capacité</th>
                <th>Équipements</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {salles.map((salle) => (
                <tr key={salle.id_salle}>
                  <td>{salle.nom}</td>
                  <td>{salle.capacite}</td>
                  <td>{salle.equipements}</td>
                  <td>
                    <span
                      className={`badge ${salle.statut === "active" ? "badge-ok" : "badge-warn"}`}
                      onClick={() => handleChangerStatut(salle)}
                      style={{ cursor: "pointer" }}
                    >
                      {salle.statut === "active" ? "Active" : "En maintenance"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <i
                        className="edit"
                        onClick={() => ouvrirEdition(salle)}
                      ></i>
                      <i
                        className="trash"
                        onClick={() => handleSupprimer(salle.id_salle)}
                      ></i>
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

export default Gestion;
