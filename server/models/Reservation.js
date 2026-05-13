const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  region: { type: String, required: true },
  country: { type: String, required: true },
  dateFrom: { type: String, required: true },
  dateTo: { type: String, required: true },
  travelers: { type: Number, required: true, default: 1 },
  totalPrice: { type: Number, required: false },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  message: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },

  tourId: { type: String },
  tourName: { type: String },
  basePrice: { type: Number },

  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "failed", "refunded"],
    default: "unpaid",
  },
  stripeSessionId: { type: String },
  stripePaymentIntentId: { type: String },
  paidAt: { type: Date },
});

module.exports = mongoose.model("Reservation", reservationSchema);
