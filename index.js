require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const { connectDB } = require("./config/db");
const cors = require("cors");
const { toNodeHandler } = require("better-auth/node");
const { getAuth } = require("./lib/auth");

app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.CLIENT_URL 
  ],
  credentials: true,
}));
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