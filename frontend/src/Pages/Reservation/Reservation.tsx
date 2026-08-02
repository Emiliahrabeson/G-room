import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./reservation.css";

interface Salle {
  id_salle: number;
  nom: string;
  capacite: number;
}

interface Creneau {
  id_creneau: number;
  label: string;
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

const Reservation = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [salles, setSalles] = useState<Salle[]>([]);
  const [idSalle, setIdSalle] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [idCreneau, setIdCreneau] = useState<number | null>(null);
  const [motif, setMotif] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [succes, setSucces] = useState("");

  // Charger la liste des salles une fois
  useEffect(() => {
    const chargerSalles = async () => {
      try {
        const data = await fetchApi("/salles/liste");
        setSalles(data);
        if (data.length > 0) setIdSalle(data[0].id_salle);
      } catch (err) {
        setError(err.message);
      }
    };

    chargerSalles();
  }, []);

  // Recharger les créneaux disponibles à chaque changement de salle ou de date
  useEffect(() => {
    const chargerCreneaux = async () => {
      if (!idSalle || !date) {
        setCreneaux([]);
        setIdCreneau(null);
        return;
      }

      try {
        const data = await fetchApi(
          `/reservations/creneaux-disponibles?id_salle=${idSalle}&date=${date}`,
        );
        setCreneaux(data);
        setIdCreneau(data.length > 0 ? data[0].id_creneau : null);
      } catch (err) {
        setError(err.message);
      }
    };

    chargerCreneaux();
  }, [idSalle, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSucces("");

    if (!idSalle || !idCreneau || !date || !motif) {
      setError("Merci de remplir tous les champs obligatoires");
      return;
    }

    try {
      const resultat = await fetchApi("/reservations", {
        method: "POST",
        body: JSON.stringify({
          id_salle: idSalle,
          id_creneau: idCreneau,
          date_reservation: date,
          motif,
          description,
        }),
      });

      setSucces(
        resultat.statut === "confirmee"
          ? "Réservation confirmée !"
          : "Demande envoyée, en attente de validation.",
      );

      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="title_bar">
        <h1>Réserver une salle</h1>
        <p>Créer une nouvelle réservation</p>

        <div className="avatar">
          {(localStorage.getItem("prenom")?.[0] ?? "") +
            (localStorage.getItem("nom")?.[0] ?? "")}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="section-title">Détails de la réservation</div>

          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <label className="field-label">Salle</label>
              <select
                value={idSalle ?? ""}
                onChange={(e) => setIdSalle(Number(e.target.value))}
              >
                {salles.map((salle) => (
                  <option key={salle.id_salle} value={salle.id_salle}>
                    {salle.nom} ({salle.capacite} places)
                  </option>
                ))}
              </select>
            </div>

            <div className="two-col field-row">
              <div>
                <label className="field-label">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="field-label">Créneau</label>
                <select
                  value={idCreneau ?? ""}
                  onChange={(e) => setIdCreneau(Number(e.target.value))}
                  disabled={creneaux.length === 0}
                >
                  {creneaux.length === 0 && (
                    <option>Aucun créneau disponible</option>
                  )}
                  {creneaux.map((c) => (
                    <option key={c.id_creneau} value={c.id_creneau}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row">
              <label className="field-label">Objet de la réservation</label>
              <input
                type="text"
                placeholder="Séance TD Algorithmique L3"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                required
              />
            </div>

            <div className="field-row">
              <label className="field-label">Description / remarques</label>
              <textarea
                rows={3}
                placeholder="Précisez le nombre de participants, le matériel requis..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {error && <p className="error">{error}</p>}
            {succes && <p className="succes">{succes}</p>}

            <div className="hint">
              {role === "enseignant"
                ? "En tant qu'enseignant, votre réservation est confirmée immédiatement."
                : "Votre réservation passe par une validation du service logistique."}
            </div>

            <button type="submit" className="btn btn-primary">
              Confirmer la réservation
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Reservation;
