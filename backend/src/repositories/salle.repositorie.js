import db from "../config/db.js";

export async function getListeSalle() {
  const sql = "SELECT * FROM salles WHERE statut = 'active';";

  const [result] = await db.query(sql);

  return result;
}

// export async function getNbSalle() {
//   const sql =
//     "SELECT COUNT(*) AS nb_disponibles FROM salles WHERE statut = 'active';";

//   const [result] = await db.query(sql);

//   return result[0];
// }

export async function getStatistiques() {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM salles WHERE statut = 'active') AS salles_disponibles,
      (SELECT COUNT(*) FROM reservations WHERE date_reservation = CURDATE()) AS reservations_aujourdhui,
      (SELECT COUNT(*) FROM reservations WHERE statut = 'en_attente') AS demandes_en_attente,
      ROUND(
        (SELECT COUNT(*) FROM reservations WHERE date_reservation = CURDATE())
        / NULLIF(
            (SELECT COUNT(*) FROM salles WHERE statut = 'active')
            * (SELECT COUNT(*) FROM creneaux),
          0)
        * 100,
      1) AS taux_occupation;
  `;

  const [result] = await db.query(sql);

  return result[0];
}
// liste detail
export async function getSalles() {
  const sql =
    "SELECT id_salle, nom, capacite, equipements, statut FROM salles ORDER BY nom;";
  const [result] = await db.query(sql);
  return result;
}
