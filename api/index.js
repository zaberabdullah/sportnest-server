// api/index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "../config/db.js";
import { getAuth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const app = express();

// CORS কনফিগারেশন একদম সিম্পল রাখো
app.use(cors({
    origin: ["https://sportnest-client-sigma.vercel.app", "http://localhost:3000"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ডাটাবেজ কানেকশন এখানে আগে নিশ্চিত করো
await connectDB(); 

const auth = getAuth();

// Better Auth হ্যান্ডলার
app.all("/api/auth/*", toNodeHandler(auth.handler));

// অন্যান্য রাউট
import facilityRoutes from "../routes/facility.js";
app.use("/api/facility", facilityRoutes);

app.get("/", (req, res) => res.json({ message: "SportNest API Active" }));

export default app;