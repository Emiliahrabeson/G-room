import db from "../config/db.js";

export async function getPlanning() {
  const sql = "";

  const [result] = await db.query(sql);

  return result;
}

export async function getCreneaux() {
  const sql =
    "SELECT id_creneau, heure_debut, heure_fin FROM creneaux ORDER BY heure_debut;";
  const [result] = await db.query(sql);
  return result;
}
