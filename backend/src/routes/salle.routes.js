import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getListe, getStatistiques } from "../controllers/salle.controller.js";

const router = express.Router();

router.get("/liste", verifyToken, getListe);
// router.get("/nb_salle", verifyToken, getNbSalle);
router.get("/stats", verifyToken, getStatistiques);

export default router;
