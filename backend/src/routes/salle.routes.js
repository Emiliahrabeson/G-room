import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyRole } from "../middleware/role.middleware.js";
import {
  getListe,
  getStatistiques,
  getSallesDetaillees,
  ajouterSalle,
  modifierSalle,
  changerStatutSalle,
  supprimerSalle,
} from "../controllers/salle.controller.js";

const router = express.Router();

router.get("/liste", verifyToken, getListe);
router.get("/stats", verifyToken, getStatistiques);
router.get("/detaillees", verifyToken, getSallesDetaillees);

router.post("/", verifyToken, ajouterSalle);
router.put("/:id", verifyToken, modifierSalle);
router.patch("/:id/statut", verifyToken, changerStatutSalle);
router.delete("/:id", verifyToken, supprimerSalle);

export default router;
