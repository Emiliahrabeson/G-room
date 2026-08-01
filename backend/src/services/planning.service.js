import * as planningRepositories from "../repositories/planning.repositories.js";
import * as salleRepositories from "../repositories/salle.repositorie.js";
import * as reservationRepositories from "../repositories/reservation.repositorie.js";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
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

function getLundiDeLaSemaine() {
  const aujourdhui = new Date();
  const jour = aujourdhui.getDay(); // 0 = dimanche, 1 = lundi
  const decalage = jour === 0 ? -6 : 1 - jour;

  const lundi = new Date(aujourdhui);
  lundi.setDate(aujourdhui.getDate() + decalage);
  return lundi;
}

function formatDateSQL(date) {
  return date.toISOString().slice(0, 10); // 2026-07-30
}

function formatHeure(heureStr) {
  const [h, m] = heureStr.split(":");
  return `${h}h${m}`;
}

export async function getPlanning(id_salle) {
  const creneaux = await planningRepositories.getCreneaux();

  const lundi = getLundiDeLaSemaine();
  const samedi = new Date(lundi);
  samedi.setDate(lundi.getDate() + 5);

  const reservations = await reservationRepositories.getReservationsSemaine(
    id_salle,
    formatDateSQL(lundi),
    formatDateSQL(samedi),
  );

  const planning = [];

  for (const creneau of creneaux) {
    const ligne = {
      horaire: `${formatHeure(creneau.heure_debut)} - ${formatHeure(creneau.heure_fin)}`,
      jours: {},
    };

    for (let i = 0; i < JOURS.length; i++) {
      const dateDuJour = new Date(lundi);
      dateDuJour.setDate(lundi.getDate() + i);
      const dateStr = formatDateSQL(dateDuJour);

      let motifTrouve = null;
      for (const r of reservations) {
        const dateResa = formatDateSQL(new Date(r.date_reservation));
        if (r.id_creneau === creneau.id_creneau && dateResa === dateStr) {
          motifTrouve = r.motif;
          break;
        }
      }

      ligne.jours[JOURS[i]] = motifTrouve;
    }

    planning.push(ligne);
  }

  return {
    semaine: `Semaine du ${lundi.getDate()} au ${samedi.getDate()} ${MOIS[samedi.getMonth()]} ${samedi.getFullYear()}`,
    planning,
  };
}
