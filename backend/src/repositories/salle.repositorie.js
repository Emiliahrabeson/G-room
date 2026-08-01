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

export async function ajouterSalle(nom, capacite, equipements) {
  const sql = `
    INSERT INTO salles (nom, capacite, equipements, statut)
    VALUES (?, ?, ?, 'active');
  `;
  const [result] = await db.query(sql, [nom, capacite, equipements]);
  return result.insertId;
}

export async function modifierSalle(id_salle, nom, capacite, equipements) {
  const sql = `
    UPDATE salles
    SET nom = ?, capacite = ?, equipements = ?
    WHERE id_salle = ?;
  `;
  await db.query(sql, [nom, capacite, equipements, id_salle]);
}

export async function changerStatutSalle(id_salle, statut) {
  const sql = "UPDATE salles SET statut = ? WHERE id_salle = ?;";
  await db.query(sql, [statut, id_salle]);
}

export async function supprimerSalle(id_salle) {
  const sql = "DELETE FROM salles WHERE id_salle = ?;";
  await db.query(sql, [id_salle]);
}
