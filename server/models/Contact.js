const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    regions: [
      {
        _id: { type: String, required: true },
        regionName: { type: String, required: true },
        contactDetails: { type: Map, of: String },
      },
    ],

    countries: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        regionId: { type: String, required: true },
      },
    ],
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
