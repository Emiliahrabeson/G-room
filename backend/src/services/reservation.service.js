import * as reservationRepositories from "../repositories/reservation.repositorie.js";
import { envoyerEmail } from "../config/mailer.js";

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
      id_reservation: d.id_reservation,
      nom: d.nom,
      role: d.role,
      nom_salle: d.nom_salle,
      motif: d.motif,
      date_horaire: `${formatDate(d.date_reservation)}, ${formatHeure(d.heure_debut)} - ${formatHeure(d.heure_fin)}`,
      statut: statutInfo.label,
      statut_brut: d.statut,
    };
  });
}

export async function getReservation_confirmees() {
  const reservations =
    await reservationRepositories.getReservation_confirmees();
  return reservations.map((d) => {
    const statutInfo = STATUT_LABELS[d.statut] || { label: d.statut };

    return {
      nom_salle: d.nom_salle,
      motif: d.motif,
      date_horaire: `${formatDate(d.date_reservation)}, ${formatHeure(d.heure_debut)} - ${formatHeure(d.heure_fin)}`,
      statut: statutInfo.label,
    };
  });
}

// export async function creerReservation(
//   id_user,
//   role,
//   id_salle,
//   id_creneau,
//   date_reservation,
//   motif,
//   description,
// ) {
//   if (!id_salle || !id_creneau || !date_reservation || !motif) {
//     console.log("Salle, créneau, date et objet sont obligatoires");
//     return;
//   }

//   const disponible = await reservationRepositories.estDisponible(
//     id_salle,
//     id_creneau,
//     date_reservation,
//   );

//   if (!disponible) {
//     throw new Error("Ce créneau est déjà réservé pour cette salle");
//   }

//   const statut = role === "enseignant" ? "confirmee" : "en_attente";

//   const id_reservation = await reservationRepositories.creerReservation(
//     id_user,
//     id_salle,
//     id_creneau,
//     date_reservation,
//     motif,
//     description,
//     statut,
//   );

//   return { id_reservation, statut };
// }

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

export async function creerReservation(
  id_user,
  role,
  email,
  id_salle,
  id_creneau,
  date_reservation,
  motif,
  description,
) {
  if (!id_salle || !id_creneau || !date_reservation || !motif) {
    throw new Error("Salle, créneau, date et objet sont obligatoires");
  }

  const disponible = await reservationRepositories.estDisponible(
    id_salle,
    id_creneau,
    date_reservation,
  );
  if (!disponible) {
    throw new Error("Ce créneau est déjà réservé pour cette salle");
  }

  const statut = role === "enseignant" ? "confirmee" : "en_attente";

  const id_reservation = await reservationRepositories.creerReservation(
    id_user,
    id_salle,
    id_creneau,
    date_reservation,
    motif,
    description,
    statut,
  );

  if (statut === "confirmee") {
    await envoyerEmail(
      email,
      "Réservation confirmée",
      `Votre réservation "${motif}" du ${date_reservation} a été confirmée.`,
    );
  } else {
    await envoyerEmail(
      email,
      "Demande de réservation reçue",
      `Votre demande "${motif}" du ${date_reservation} a été envoyée au service logistique pour validation.`,
    );
  }

  return { id_reservation, statut };
}

export async function traiterDemande(id_reservation, decision) {
  if (decision !== "confirmee" && decision !== "refusee") {
    throw new Error("Décision invalide");
  }

  const reservation =
    await reservationRepositories.getReservationDetail(id_reservation);
  if (!reservation) {
    throw new Error("Réservation introuvable");
  }

  await reservationRepositories.changerStatutDemande(id_reservation, decision);

  const sujet =
    decision === "confirmee" ? "Réservation acceptée" : "Réservation refusée";
  const texte =
    decision === "confirmee"
      ? `Votre demande "${reservation.motif}" pour la salle ${reservation.nom_salle} le ${reservation.date_reservation} a été acceptée.`
      : `Votre demande "${reservation.motif}" pour la salle ${reservation.nom_salle} le ${reservation.date_reservation} a été refusée.`;

  await envoyerEmail(reservation.email, sujet, texte);

  return { message: "Demande traitée avec succès" };
}
