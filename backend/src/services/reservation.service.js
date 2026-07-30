import * as reservationRepositories from "../repositories/reservation.repositorie.js";
import * as salleRepositories from "../repositories/salle.repositorie.js";

export async function getDemandeEnAttente() {
  return {
    demandeur: user.nom,
    salle: salle.nom,
    date: horaire,
  };
}
