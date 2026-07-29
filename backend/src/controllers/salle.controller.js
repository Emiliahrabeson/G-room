import * as salleService from "../services/salle.service.js";

export const getListe = async (req, res) => {
  try {
    const liste = await salleService.getListe();

    res.status(200).json(liste);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// export const getNbSalle = async (req, res) => {
//   try {
//     const nb = await salleService.getNbSalle();

//     res.status(200).json(nb);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

export const getStatistiques = async (req, res) => {
  try {
    const stats = await salleService.getStatistiques();
    res.status(200).json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getSallesDetaillees = async (req, res) => {
  try {
    const salles = await salleService.getSallesDetaillees();
    res.status(200).json(salles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
