const express = require("express");
const router = express.Router();
const { protect, adminAuth } = require("../middleware/auth");
const Destination = require("../models/Destination");

router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find().sort({
      order: 1,
      createdAt: -1,
    });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination)
      return res.status(404).json({ message: "Destination not found" });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", protect, adminAuth, async (req, res) => {
  try {
    const {
      name,
      region,
      country,
      description,
      price,
      image,
      featured,
      duration,
      features,
      order,
    } = req.body;

    const newDestination = new Destination({
      name,
      region,
      country,
      description,
      price,
      image,
      featured: featured || false,
      duration: duration || "7 days",
      features: features || [],
      order: order || 0,
    });

    await newDestination.save();
    res
      .status(201)
      .json({
        message: "Destination created successfully!",
        destination: newDestination,
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", protect, adminAuth, async (req, res) => {
  try {
    const updateData = req.body;

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!destination)
      return res.status(404).json({ message: "Destination not found" });

    res.json({ message: "Destination updated successfully!", destination });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", protect, adminAuth, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination)
      return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
