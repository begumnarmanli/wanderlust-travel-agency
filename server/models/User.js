const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

UserSchema.virtual("userName").get(function () {
  return this.fullName;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
