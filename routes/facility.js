const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const {
      name,
      facility_type,
      location,
      price_per_hour,
      capacity,
      available_slots,
      description,
      owner_email,
      image,
    } = req.body;

    const newFacility = {
      name,
      facility_type,
      location,
      price_per_hour: parseFloat(price_per_hour),
      capacity: parseInt(capacity),
      available_slots: Array.isArray(available_slots) ? available_slots : [available_slots], // slots array
      description,
      owner_email,
      image,
      booking_count: 0,
      createdAt: new Date(),
    };

    const result = await db.collection("facilities").insertOne(newFacility);
    res.status(201).json({ success: true, message: "Facility added successfully!", facilityId: result.insertedId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { search, type } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (type) {
      const typesArray = type.split(",");
      query.facility_type = { $in: typesArray };
    }

    const facilities = await db.collection("facilities").find(query).toArray();
    res.json({ success: true, facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const facility = await db.collection("facilities").findOne({ _id: new ObjectId(id) });
    if (!facility) {
      return res.status(404).json({ success: false, message: "Facility not found!" });
    }

    res.json({ success: true, facility });
  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid Facility ID format!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const result = await db.collection("facilities").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Facility not found!" });
    }

    res.json({ success: true, message: "Facility deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
