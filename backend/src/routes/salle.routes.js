import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getListe,
  //   getNbSalle,
  getStatistiques,
  getSallesDetaillees,
} from "../controllers/salle.controller.js";

const router = express.Router();

router.get("/liste", verifyToken, getListe);
// router.get("/nb", verifyToken, getNbSalle);
router.get("/stats", verifyToken, getStatistiques);
router.get("/detaillees", verifyToken, getSallesDetaillees);

export default router;
