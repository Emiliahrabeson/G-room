import * as statistiqueRepositories from "../repositories/statistique.repositories.js";

export async function getStatistiques() {
  const occupationParSalle =
    await statistiqueRepositories.getOccupationParSalle();
  const reservationsParSemaine =
    await statistiqueRepositories.getReservationsParSemaine();
  const salleLaPlusDemandee =
    await statistiqueRepositories.getSalleLaPlusDemandee();
  const reservationsCeMois =
    await statistiqueRepositories.getReservationsCeMois();
  const { refusees, total } = await statistiqueRepositories.getTauxAnnulation();

  const tauxAnnulation = total > 0 ? Math.round((refusees / total) * 100) : 0;

  return {
    occupationParSalle: occupationParSalle.map((s) => ({
      nom: s.nom,
      nb_reservations: s.nb_reservations,
    })),
    reservationsParSemaine: reservationsParSemaine.map((s) => ({
      semaine: s.semaine,
      nb: s.nb,
    })),
    salleLaPlusDemandee: salleLaPlusDemandee ? salleLaPlusDemandee.nom : "—",
    reservationsCeMois,
    tauxAnnulation: `${tauxAnnulation}%`,
    delaiMoyenValidation: "—", // non calculable pour l'instant, voir note plus bas
  };
}
