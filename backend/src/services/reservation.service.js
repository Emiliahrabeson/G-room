import * as reservationRepositories from "../repositories/reservation.repositorie.js";

const STATUT_LABELS = {
  en_attente: { label: "En attente" },
  confirmee: { label: "Acceptée" },
  refusee: { label: "Refusée" },
};

const MOIS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

function formatDate(dateString) {
  const date = new Date(dateString);
  const jour = date.getDate();
  const mois = MOIS[date.getMonth()];
  return `${jour} ${mois}`;
}

function formatHeure(heureString) {
  const [heures, minutes] = heureString.split(":");
  return `${heures}h${minutes}`;
}

export async function getDemande() {
  const demandes = await reservationRepositories.getDemande();
  return demandes.map((d) => {
    const statutInfo = STATUT_LABELS[d.statut] || { label: d.statut };

    return {
      nom: d.nom,
      role: d.role,
      nom_salle: d.nom_salle,
      motif: d.motif,
      date_horaire: `${formatDate(d.date_reservation)}, ${formatHeure(d.heure_debut)} - ${formatHeure(d.heure_fin)}`,
      statut: statutInfo.label,
    };
  });
}

export async function creerReservation(
  id_user,
  role,
  id_salle,
  id_creneau,
  date_reservation,
  motif,
  description,
) {
  if (!id_salle || !id_creneau || !date_reservation || !motif) {
    console.log("Salle, créneau, date et objet sont obligatoires");
    return;
  }

  const disponible = await reservationRepositories.estDisponible(
    id_salle,
    id_creneau,
    date_reservation,
  );

  if (!disponible) {
    throw new Error("Ce créneau est déjà réservé pour cette salle");
  }
  const statut = "";
  if (role === "enseignant") {
    statut = "confirmee";
  } else {
    statut = "en_attente";
  }
  // const statut = role === "enseignant" ? "confirmee" : "en_attente";

  const id_reservation = await reservationRepositories.creerReservation(
    id_user,
    id_salle,
    id_creneau,
    date_reservation,
    motif,
    description,
    statut,
  );

  return { id_reservation, statut };
}

export async function getCreneauxDisponibles(id_salle, date_reservation) {
  const creneaux = await reservationRepositories.getCreneauxDisponibles(
    id_salle,
    date_reservation,
  );

  return creneaux.map((c) => ({
    id_creneau: c.id_creneau,
    label: `${formatHeure(c.heure_debut)} - ${formatHeure(c.heure_fin)}`,
  }));
}
