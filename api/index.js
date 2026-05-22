import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "../config/db.js";
import { getAuth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const app = express();


const corsOptions = {
  origin: [
    "http://localhost:3000", 
    "https://sportnest-client-sigma.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
const connectDB = require('../config/db');
connectDB();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight fix

app.use(express.json());
app.use(cookieParser());

// 2. DB Connect
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

// 4. Tor Routes
import facilityRoutes from "../routes/facility.js";
import bookingRoutes from "../routes/booking.js";

app.use("/api/facility", facilityRoutes);
app.use("/api/booking", bookingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SPORTnest Server Running on Vercel" });
});

export default app;