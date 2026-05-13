require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: [
      "https://wanderlust-travel-2025.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
const stripeRoutes = require("./routes/stripe");
app.use("/api/stripe", stripeRoutes);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/destinations", require("./routes/destinationRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use((req, res, next) => {
  console.log(`No incoming request found: ${req.method} ${req.url}`);
  res.status(404).json({
    message:
      "The route you are looking for was not found on the server. (404).",
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res
    .status(500)
    .json({ message: "A server error occurred!", error: err.message });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connection successful.");
    app.listen(PORT, () => {
      console.log(`The server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
