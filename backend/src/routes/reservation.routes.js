import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getDemande,
  creerReservation,
  getCreneauxDisponibles,
} from "../controllers/reservation.controller.js";

const router = express.Router();

router.post("/", verifyToken, creerReservation);
router.get("/demande", verifyToken, getDemande);
router.get("/creneaux-disponibles", verifyToken, getCreneauxDisponibles);

export default router;
