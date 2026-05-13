const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/auth.js");

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id)
      .populate("favorites")
      .select("-password");

    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.put("/update-profile", protect, async (req, res) => {
  try {
    const { fullName } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (fullName) user.userName = fullName;

    await user.save();

    res.json({
      fullName: user.fullName,
      userName: user.userName,
      email: user.userEmail || user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.put("/update-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.post("/favorite/:tourId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { tourId } = req.params;

    if (!user) return res.status(404).json({ message: "User not found" });

    const isFavorite = user.favorites.includes(tourId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id.toString() !== tourId);
    } else {
      user.favorites.push(tourId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Favorite process failed", error: err.message });
  }
});

module.exports = router;
