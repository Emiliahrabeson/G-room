import * as reservationService from "../services/reservation.service.js";

export const getDemande = async (req, res) => {
  try {
    const demandes = await reservationService.getDemande();
    res.status(200).json(demandes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
