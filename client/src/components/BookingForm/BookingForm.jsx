import React, { useState } from "react";
import styles from "./BookingForm.module.css";
import { API_URL } from "../../config";
const BookingForm = ({ tour }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateFrom: "",
    dateTo: "",
    travelers: 1,
  });

  const totalPrice = tour ? formData.travelers * tour.price : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "travelers" ? parseInt(value) || 1 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const bookingData = {
      ...formData,
      userId: userId,
      tourId: tour._id,
      tourName: tour.name,
      totalPrice: totalPrice,
      status: "pending",
      paymentStatus: "unpaid",
    };

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert("Booking successful!");
        window.dispatchEvent(new Event("profileUpdate"));
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  return (
    <div className={styles.bookingContainer}>
      <h3>Book {tour?.name}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <div className={styles.row}>
          <label>
            From:{" "}
            <input
              type="date"
              name="dateFrom"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            To:{" "}
            <input type="date" name="dateTo" onChange={handleChange} required />
          </label>
        </div>

        <div className={styles.travelers}>
          <label>Travelers:</label>
          <input
            type="number"
            name="travelers"
            min="1"
            value={formData.travelers}
            onChange={handleChange}
          />
        </div>

        <div className={styles.priceSummary}>
          <span>Total Price:</span>
          <strong>${totalPrice}</strong>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
