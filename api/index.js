import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "../config/db.js";
import { getAuth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://sportnest-client-sigma.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

let dbConnected = false;
app.use(async (req, res, next) => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
    next();
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const auth = getAuth();
app.use("/api/auth", toNodeHandler(auth.handler));

// Routes import kor - .js lagbe
import facilityRoutes from "../routes/facility.js";
import bookingRoutes from "../routes/booking.js";

app.use("/api/facility", facilityRoutes);
app.use("/api/booking", bookingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SPORTnest Server Running on Vercel" });
});

export default app;