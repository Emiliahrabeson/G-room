import db from "../config/db.js";

export async function getOccupationParSalle() {
  const sql = `
    SELECT s.nom, COUNT(r.id_reservation) AS nb_reservations
    FROM salles s
    LEFT JOIN reservations r
      ON r.id_salle = s.id_salle
      AND r.statut = 'confirmee'
      AND MONTH(r.date_reservation) = MONTH(CURDATE())
      AND YEAR(r.date_reservation) = YEAR(CURDATE())
    GROUP BY s.id_salle, s.nom
    ORDER BY nb_reservations DESC;
  `;
  const [result] = await db.query(sql);
  return result;
}

export async function getReservationsParSemaine() {
  const sql = `
    SELECT YEARWEEK(date_reservation, 1) AS semaine, COUNT(*) AS nb
    FROM reservations
    WHERE statut = 'confirmee'
      AND date_reservation >= CURDATE() - INTERVAL 6 WEEK
    GROUP BY semaine
    ORDER BY semaine;
  `;
  const [result] = await db.query(sql);
  return result;
}

export async function getSalleLaPlusDemandee() {
  const sql = `
    SELECT s.nom, COUNT(r.id_reservation) AS nb
    FROM reservations r
    JOIN salles s ON s.id_salle = r.id_salle
    GROUP BY s.id_salle, s.nom
    ORDER BY nb DESC
    LIMIT 1;
  `;
  const [result] = await db.query(sql);
  return result[0] || null;
}

export async function getReservationsCeMois() {
  const sql = `
    SELECT COUNT(*) AS nb
    FROM reservations
    WHERE MONTH(date_reservation) = MONTH(CURDATE())
      AND YEAR(date_reservation) = YEAR(CURDATE());
  `;
  const [result] = await db.query(sql);
  return result[0].nb;
}

export async function getTauxAnnulation() {
  const sql = `
    SELECT
      SUM(statut = 'refusee') AS refusees,
      COUNT(*) AS total
    FROM reservations;
  `;
  const [result] = await db.query(sql);
  return result[0];
}
