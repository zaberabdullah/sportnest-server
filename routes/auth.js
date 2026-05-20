const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");

router.post("/register", async (req, res) => {
  try {
    const db = getDB();
    const { name, email, password, photoURL } = req.body;

    const userExists = await db.collection("users").findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    const newUser = {
      name,
      email,
      password,
      photoURL,
      role: "user",
    };

    const result = await db.collection("users").insertOne(newUser);
    res.status(201).json({ success: true, message: "User registered successfully!", userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;

    const user = await db.collection("users").findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password!" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user;
    res.json({ success: true, message: "Login successful!", user: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
