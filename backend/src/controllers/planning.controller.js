import * as planningService from "../services/planning.service.js";

export const getPlanning = async (req, res) => {
  try {
    const { id_salle } = req.query;

    if (!id_salle) {
      return res.status(400).json({ error: "selection d'une salle requis" });
    }

    const plan = await planningService.getPlanning(id_salle);
    res.status(200).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
