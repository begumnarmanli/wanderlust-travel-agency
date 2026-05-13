const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { protect, adminAuth } = require("../middleware/auth");

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      region,
      country,
      dateFrom,
      dateTo,
      travelers,
      message,
      totalPrice,
    } = req.body;

    if (!name || !email || !region || !country || !dateFrom || !dateTo) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const reservation = await Reservation.create({
      name,
      email,
      region,
      country,
      dateFrom,
      dateTo,
      travelers: travelers || 1,
      message: message || "",
      totalPrice: totalPrice || null,
      status: "pending",
    });

    res.status(201).json({
      message:
        "Reservation request sent successfully! We'll contact you within 24 hours.",
      reservation,
    });
  } catch (err) {
    console.error("Reservation creation error:", err);
    res.status(500).json({
      message: "Failed to create reservation",
      error: err.message,
    });
  }
});

router.get("/my-reservations", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(reservations);
  } catch (err) {
    console.error("Fetch user reservations error:", err);
    res.status(500).json({
      message: "Failed to fetch reservations",
      error: err.message,
    });
  }
});

router.get("/", protect, adminAuth, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    console.error("Fetch reservations error:", err);
    res.status(500).json({
      message: "Failed to fetch reservations",
      error: err.message,
    });
  }
});

router.get("/:id", protect, adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (err) {
    console.error("Fetch reservation error:", err);
    res.status(500).json({
      message: "Failed to fetch reservation",
      error: err.message,
    });
  }
});

router.put("/:id", protect, adminAuth, async (req, res) => {
  try {
    const { status, notes, totalPrice } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (status) reservation.status = status;
    if (notes !== undefined) reservation.notes = notes;
    if (totalPrice !== undefined) reservation.totalPrice = totalPrice;

    await reservation.save();

    res.json({
      message: "Reservation updated successfully",
      reservation,
    });
  } catch (err) {
    console.error("Update reservation error:", err);
    res.status(500).json({
      message: "Failed to update reservation",
      error: err.message,
    });
  }
});

router.delete("/:id", protect, adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await reservation.deleteOne();

    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    console.error("Delete reservation error:", err);
    res.status(500).json({
      message: "Failed to delete reservation",
      error: err.message,
    });
  }
});

router.get("/stats/total-revenue", protect, adminAuth, async (req, res) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $match: { paymentStatus: "paid" },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalPrice" },
        },
      },
    ]);

    const total = stats.length > 0 ? stats[0].totalAmount : 0;
    res.json({ totalRevenue: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/cancel/:id", protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.userId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to cancel this reservation" });
    }

    if (reservation.paymentStatus === "paid") {
      if (reservation.paymentIntentId) {
        try {
          await stripe.refunds.create({
            payment_intent: reservation.paymentIntentId,
          });
          reservation.paymentStatus = "refunded";
        } catch (stripeErr) {
          console.error("Stripe Refund Error:", stripeErr);
          reservation.paymentStatus = "refunded";
        }
      } else {
        reservation.paymentStatus = "refunded";
      }
    }

    reservation.status = "cancelled";
    await reservation.save();

    res.json({
      message:
        "Reservation successfully cancelled and refund initiated if applicable.",
      reservation,
    });
  } catch (err) {
    console.error("Cancellation Error:", err);
    res.status(500).json({ message: "Server error during cancellation" });
  }
});
module.exports = router;
