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

export async function getDemandeEnAttente() {
  const sql = `
    SELECT r.id_salle, c.heure_debut,r.date_reservation,r.motif, r.statut, c.heure_fin
    FROM reservations r
    JOIN creneaux c ON c.id_creneau = r.id_creneau
    WHERE r.date_reservation = CURDATE() || CURDATE() < 
      AND r.statut = 'en attente';
  `;

  const [result] = await db.query(sql);

  return result;
}
