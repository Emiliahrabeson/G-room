import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getDemande } from "../controllers/reservation.controller.js";

const router = express.Router();

router.get("/demande", verifyToken, getDemande);

export default router;
