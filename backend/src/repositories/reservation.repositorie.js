import db from "../config/db.js";

export async function getReservationsAujourdhui() {
  const sql = `
    SELECT r.id_salle, c.heure_debut, c.heure_fin
    FROM reservations r
    JOIN creneaux c ON c.id_creneau = r.id_creneau
    WHERE r.date_reservation = CURDATE()
      AND r.statut = 'confirmee';
  `;
  const [result] = await db.query(sql);
  return result;
}

export async function getDemande() {
  const sql = `
    SELECT u.nom, u.role , s.nom as nom_salle, c.heure_debut, r.date_reservation, r.motif, r.statut, c.heure_fin
    FROM reservations r
    JOIN creneaux c ON c.id_creneau = r.id_creneau
    JOIN salles s ON s.id_salle = r.id_salle
    JOIN utilisateurs u ON r.id_user = u.id_user
      AND r.date_reservation >= CURDATE()
    ORDER BY r.date_reservation, c.heure_debut;
  `;

  const [result] = await db.query(sql);

  return result;
}
