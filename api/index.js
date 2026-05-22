const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");


app.set("trust proxy", 1); 

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://sportnest-client-sigma.vercel.app", 
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 


const { connectDB, getDB } = require("../config/db");
let dbConnected = false;

app.use(async (req, res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
    console.log("Database connected!");
  }
  next();
});


const { getAuth } = require("../lib/auth");
const { toNodeHandler } = require("better-auth/node");
const auth = getAuth();


app.use("/api/auth", toNodeHandler(auth.handler));


app.use("/api/facility", require("../routes/facility"));
app.use("/api/booking", require("../routes/booking"));

app.get("/", (req, res) => {
  res.json({ message: "SPORTnest Server Running on Vercel" });
});


module.exports = app;