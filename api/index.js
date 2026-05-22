import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "../config/db.js";
import { getAuth } from "../lib/auth.js";
import facilityRoutes from "../routes/facility.js";

const app = express();

app.use(cors({
  origin: ["https://sportnest-client-sigma.vercel.app", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

await connectDB();

const { handler } = getAuth(); 

app.use("/api/auth", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" 
      ? JSON.stringify(req.body) 
      : undefined,
  });
  
  const response = await handler(request);
  
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  const text = await response.text();
  res.send(text);
});

app.use("/api/facility", facilityRoutes);
app.get("/", (req, res) => res.json({ message: "SportNest API Active" }));

export default app;