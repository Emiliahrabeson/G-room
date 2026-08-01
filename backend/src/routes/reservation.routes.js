import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getDemande,
  creerReservation,
  getCreneauxDisponibles,
  getReservation_confirmees,
} from "../controllers/reservation.controller.js";

const router = express.Router();

router.post("/", verifyToken, creerReservation);
router.get("/demande", verifyToken, getDemande);
router.get("/reservation_confirmees", verifyToken, getReservation_confirmees);
router.get("/creneaux-disponibles", verifyToken, getCreneauxDisponibles);

export default router;
