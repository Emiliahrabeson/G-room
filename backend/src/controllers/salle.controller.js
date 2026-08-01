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

export const ajouterSalle = async (req, res) => {
  try {
    const { nom, capacite, equipements } = req.body;
    const id_salle = await salleService.ajouterSalle(
      nom,
      capacite,
      equipements,
    );
    res.status(201).json({ id_salle, message: "Salle ajoutée avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const modifierSalle = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, capacite, equipements } = req.body;
    await salleService.modifierSalle(id, nom, capacite, equipements);
    res.status(200).json({ message: "Salle modifiée avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const changerStatutSalle = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    await salleService.changerStatutSalle(id, statut);
    res.status(200).json({ message: "Statut mis à jour" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const supprimerSalle = async (req, res) => {
  try {
    const { id } = req.params;
    await salleService.supprimerSalle(id);
    res.status(200).json({ message: "Salle supprimée avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
