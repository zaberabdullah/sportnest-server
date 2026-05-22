require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser"); // <-- ADD KORO
const PORT = process.env.PORT || 5000;

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
app.options("/{*any}", cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 

const { connectDB } = require("./config/db");
const { getAuth } = require("./lib/auth");
const { toNodeHandler } = require("better-auth/node");

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully!");

    const auth = getAuth();

  
    app.use("/api/auth", toNodeHandler(auth.handler));

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