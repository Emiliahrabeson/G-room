import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import salleRoutes from "./routes/salle.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import planningRoutes from "./routes/planning.routes.js";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/salles", salleRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/planning/", planningRoutes);

export default app;
