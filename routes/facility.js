const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { requireAuth } = require("../middleware/auth"); 


router.post("/", async (req, res) => {
  console.log("HIT BACKEND POST /api/facility");
  console.log("Body:", req.body);
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
      image,
      owner_email, 
    } = req.body;

   
    if (!owner_email) {
      return res.status(400).json({ success: false, message: "owner_email is required" });
    }

    const newFacility = {
      name,
      facility_type,
      location,
      price_per_hour: parseFloat(price_per_hour),
      capacity: parseInt(capacity),
      available_slots: Array.isArray(available_slots)? available_slots : [available_slots],
      description,
      owner_email,
      image,
      booking_count: 0,
      createdAt: new Date(),
    };

    const result = await db.collection("facilities").insertOne(newFacility);
    res.status(201).json({
      success: true,
      message: "Facility added successfully!",
      facilityId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { search, type, user_email } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (type) {
      const typesArray = type.split(",");
      query.facility_type = { $in: typesArray };
    }

    if (user_email) {
      query.owner_email = user_email;
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


router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const facility = await db.collection("facilities").findOne({ _id: new ObjectId(id) });

    if (!facility) {
      return res.status(404).json({ success: false, message: "Facility not found!" });
    }

    if (facility.owner_email!== req.user.email) {
      return res.status(403).json({ success: false, message: "You can only delete your own facility" });
    }

    const result = await db.collection("facilities").deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true, message: "Facility deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.owner_email;
    delete updateData._id;

    const facility = await db.collection("facilities").findOne({ _id: new ObjectId(id) });

    if (!facility) {
      return res.status(404).json({ success: false, message: "Facility not found!" });
    }

    if (facility.owner_email!== req.user.email) {
      return res.status(403).json({ success: false, message: "You can only update your own facility" });
    }

    const result = await db.collection("facilities").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    res.json({ success: true, message: "Facility updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;