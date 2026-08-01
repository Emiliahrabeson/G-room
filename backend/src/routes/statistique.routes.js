import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getStatistiques } from "../controllers/statistique.controller.js";

const router = express.Router();

router.get("/", verifyToken, getStatistiques);

export default router;
