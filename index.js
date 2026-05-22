require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors"); 
const PORT = process.env.PORT || 5000;
const { connectDB } = require("./config/db");
const { toNodeHandler } = require("better-auth/node");
const { getAuth } = require("./lib/auth");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://sportnest-client-sigma.vercel.app", 
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully!");

    const auth = getAuth();

   
    app.all("/api/auth/*splat", toNodeHandler(auth.handler));

    app.use("/api/facility", require("./routes/facility"));
    app.use("/api/booking", require("./routes/booking"));

    app.get("/", (req, res) => {
      res.json({ message: "SPORTnest Server Running" });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("CRITICAL STARTUP ERROR:", err);
    process.exit(1);
  }
};

startServer();