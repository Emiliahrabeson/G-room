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

export async function getReservation_confirmees() {
  const sql = `
    SELECT u.nom, u.role , s.nom as nom_salle, c.heure_debut, r.date_reservation, r.motif, r.statut, c.heure_fin
    FROM reservations r
    JOIN creneaux c ON c.id_creneau = r.id_creneau
    JOIN salles s ON s.id_salle = r.id_salle
    JOIN utilisateurs u ON r.id_user = u.id_user
    ORDER BY r.date_reservation, c.heure_debut;
  `;

  const [result] = await db.query(sql);

  return result;
}

export async function getReservationsSemaine(id_salle, date_debut, date_fin) {
  const sql = `
    SELECT r.id_creneau, r.date_reservation, r.motif
    FROM reservations r
    WHERE r.id_salle = ?
      AND r.date_reservation BETWEEN ? AND ?
      AND r.statut = 'confirmee';
  `;
  const [result] = await db.query(sql, [id_salle, date_debut, date_fin]);
  return result;
}

export async function estDisponible(id_salle, id_creneau, date_reservation) {
  const sql = `
    SELECT COUNT(*) AS nb
    FROM reservations
    WHERE id_salle = ?
      AND id_creneau = ?
      AND date_reservation = ?
      AND statut IN ('confirmee', 'en_attente');
  `;
  const [result] = await db.query(sql, [
    id_salle,
    id_creneau,
    date_reservation,
  ]);
  return result[0].nb === 0;
}

export async function creerReservation(
  id_user,
  id_salle,
  id_creneau,
  date_reservation,
  motif,
  description,
  statut,
) {
  const sql = `
    INSERT INTO reservations (id_user, id_salle, id_creneau, date_reservation, motif, description, statut)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const [result] = await db.query(sql, [
    id_user,
    id_salle,
    id_creneau,
    date_reservation,
    motif,
    description,
    statut,
  ]);
  return result;
}

export async function getCreneauxDisponibles(id_salle, date_reservation) {
  const sql = `
    SELECT c.id_creneau, c.heure_debut, c.heure_fin
    FROM creneaux c
    WHERE c.id_creneau NOT IN (
      SELECT r.id_creneau
      FROM reservations r
      WHERE r.id_salle = ?
        AND r.date_reservation = ?
        AND r.statut IN ('confirmee', 'en_attente')
    )
    ORDER BY c.heure_debut;
  `;
  const [result] = await db.query(sql, [id_salle, date_reservation]);
  return result;
}
