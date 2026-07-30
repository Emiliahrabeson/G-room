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
