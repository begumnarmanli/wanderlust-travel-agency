const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect, adminAuth } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({});
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/", protect, adminAuth, async (req, res) => {
  try {
    const updatedContact = await Contact.findOneAndReplace({}, req.body, {
      new: true,
      upsert: true,
    });

    res.json(updatedContact);
  } catch (err) {
    res.status(500).json({ error: "The deletion and update process failed." });
  }
});

module.exports = router;
