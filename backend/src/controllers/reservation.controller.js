import * as reservationService from "../services/reservation.service.js";

export const getDemande = async (req, res) => {
  try {
    const demandes = await reservationService.getDemande();
    res.status(200).json(demandes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getReservation_confirmees = async (req, res) => {
  try {
    const reservations = await reservationService.getReservation_confirmees();
    res.status(200).json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const creerReservation = async (req, res) => {
  try {
    const { id_salle, id_creneau, date_reservation, motif, description } =
      req.body;
    const { id: id_user, role } = req.user;

    const resultat = await reservationService.creerReservation(
      id_user,
      role,
      id_salle,
      id_creneau,
      date_reservation,
      motif,
      description,
    );

    res.status(201).json(resultat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCreneauxDisponibles = async (req, res) => {
  try {
    const { id_salle, date } = req.query;

    if (!id_salle || !date) {
      return res.status(400).json({ error: "id_salle et date sont requis" });
    }

    const creneaux = await reservationService.getCreneauxDisponibles(
      id_salle,
      date,
    );
    res.status(200).json(creneaux);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
