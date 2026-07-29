import * as salleRepositories from "../repositories/salle.repositorie.js";

export async function getListe() {
  const liste = await salleRepositories.getListeSalle();

  return liste;
}

// export async function getNbSalle() {
//   const nb = await salleRepositories.getNbSalle();

//   return nb;
// }

export async function getStatistiques() {
  return await salleRepositories.getStatistiques();
}

export async function getSallesDetaillees() {
  const salles = await salleRepositories.getSalles();
  const reservations = await salleRepositories.getReservationsAujourdhui();

  const resultat = [];

  for (const salle of salles) {
    // toutes les réservations de cette salle pour aujourd'hui
    const resasDeLaSalle = [];
    for (const r of reservations) {
      if (r.id_salle === salle.id_salle) {
        resasDeLaSalle.push(r);
      }
    }

    // chercher s'il y en a une en cours maintenant parmi les resaDeLaSalle
    let resaEnCours = null;
    for (const r of resasDeLaSalle) {
      if (estEnCours(r.heure_debut, r.heure_fin)) {
        resaEnCours = r;
        break;
      }
    }

    // Déterminer l'état de la salle
    let etat;
    let etatLabel;
    let disponibilite;

    if (salle.statut === "inactive") {
      etat = "maintenance";
      etatLabel = "Maintenance";
      disponibilite = "Indisponible";
    } else if (resaEnCours !== null) {
      etat = "busy";
      etatLabel = "Occupée";
      disponibilite = `${resaEnCours.heure_debut} - ${resaEnCours.heure_fin}`;
    } else if (resasDeLaSalle.length > 0) {
      etat = "ok";
      etatLabel = "Disponible";
      disponibilite = "Aujourd'hui";
    } else {
      etat = "ok";
      etatLabel = "Disponible";
      disponibilite = "Libre";
    }

    // l'objet final pour cette salle
    resultat.push({
      nom: salle.nom,
      capacite: `${salle.capacite} places`,
      equipements: salle.equipements,
      etat: etat,
      etatLabel: etatLabel,
      disponibilite: disponibilite,
    });
  }

  return resultat;
}

// Compare l'heure actuelle avec le début/fin d'un créneau
function estEnCours(heure_debut, heure_fin) {
  const maintenant = new Date().toTimeString().slice(0, 8);
  return maintenant >= heure_debut && maintenant <= heure_fin;
}
