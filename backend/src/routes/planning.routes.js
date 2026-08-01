import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getPlanning } from "../controllers/planning.controller.js";

const router = express.Router();

router.get("/", verifyToken, getPlanning);

export default router;
