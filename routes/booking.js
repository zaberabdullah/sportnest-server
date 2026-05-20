const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { facility_id, user_email, booking_date, time_slot, hours, total_price } = req.body;

    const facilityObjectId = new ObjectId(facility_id);

    const existingBooking = await db.collection("bookings").findOne({
      facility_id: facilityObjectId,
      booking_date: booking_date,
      time_slot: time_slot,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: "This time slot is already booked!" });
    }

    const newBooking = {
      facility_id: facilityObjectId,
      user_email,
      booking_date,
      time_slot,
      hours: parseInt(hours),
      total_price: parseFloat(total_price),
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(newBooking);

    await db.collection("facilities").updateOne({ _id: facilityObjectId }, { $inc: { booking_count: 1 } });

    res.status(201).json({
      success: true,
      message: "Booking submitted! Status is pending.",
      bookingId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/my-bookings/:email", async (req, res) => {
  try {
    const db = getDB();
    const { email } = req.params;

    const bookings = await db
      .collection("bookings")
      .aggregate([
        { $match: { user_email: email } },
        {
          $lookup: {
            from: "facilities",
            localField: "facility_id",
            foreignField: "_id",
            as: "facility_details",
          },
        },
        { $unwind: "$facility_details" },
      ])
      .toArray();

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/cancel/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const result = await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "cancelled" } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Booking not found or already cancelled" });
    }

    res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
