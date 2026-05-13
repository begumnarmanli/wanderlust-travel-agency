const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: {
    type: String,
    required: true,
    enum: ["europe", "asia", "americas", "africa", "oceania"],
  },
  country: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  duration: { type: String, default: "7 days" },
  features: {
    type: [String],
    default: [],
  },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Destination", destinationSchema);
