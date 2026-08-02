import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyRole } from "../middleware/role.middleware.js";

import {
  getDemande,
  creerReservation,
  getCreneauxDisponibles,
  getReservation_confirmees,
  traiterDemande,
} from "../controllers/reservation.controller.js";

const router = express.Router();

router.post("/", verifyToken, creerReservation);
router.get("/demande", verifyToken, getDemande);
router.get("/reservation_confirmees", verifyToken, getReservation_confirmees);
router.get("/creneaux-disponibles", verifyToken, getCreneauxDisponibles);
router.patch(
  "/:id/traiter",
  verifyToken,
  verifyRole("logistique", "admin"),
  traiterDemande,
);

export default router;
