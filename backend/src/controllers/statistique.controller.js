import * as statistiqueService from "../services/statistique.service.js";

export const getStatistiques = async (req, res) => {
  try {
    const stats = await statistiqueService.getStatistiques();
    res.status(200).json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
