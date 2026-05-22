import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "../config/db.js"; // ✅ same file
import { getAuth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import facilityRoutes from "../routes/facility.js";

const app = express();

app.use(cors({
  origin: ["https://sportnest-client-sigma.vercel.app", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

await connectDB(); // ✅ ekbar connect, getDB() everywhere use hobe

const auth = getAuth();

app.use("/api/auth", (req, res, next) => {
  req.url = req.url || "/";
  return toNodeHandler(auth.handler)(req, res);
});

app.use("/api/facility", facilityRoutes);
app.get("/", (req, res) => res.json({ message: "SportNest API Active" }));

export default app;