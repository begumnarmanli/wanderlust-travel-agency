import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import styles from "./Booking.module.css";
import { API_URL } from "../config";
function Booking() {
  const [searchParams] = useSearchParams();

  const urlTourId = searchParams.get("tourId");
  const urlTourName = searchParams.get("tourName");
  const urlBasePrice = searchParams.get("basePrice");
  const urlName = searchParams.get("name");
  const urlEmail = searchParams.get("email");
  const urlCountry = searchParams.get("country");
  const urlRegion = searchParams.get("region");
  const urlDateFrom = searchParams.get("dateFrom");
  const urlDateTo = searchParams.get("dateTo");
  const urlNumberOfPeople = searchParams.get("numberOfPeople");
  const urlSpecialRequests = searchParams.get("specialRequests");
  const [formData, setFormData] = useState({
    tourId: urlTourId || "",
    tourName: urlTourName || "",
    basePrice: urlBasePrice ? Number(urlBasePrice) : 0,
    name: urlName || "",
    email: urlEmail || "",
    phone: "",
    country: urlCountry || "",
    region: urlRegion || "",
    dateFrom: urlDateFrom || "",
    dateTo: urlDateTo || "",
    numberOfPeople: urlNumberOfPeople ? Number(urlNumberOfPeople) : 1,
    specialRequests: urlSpecialRequests || "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);

  useEffect(() => {
    const fetchTourDetails = async () => {
      if (urlTourId && !urlCountry && !urlRegion) {
        try {
          const response = await fetch(
            `${API_URL}/api/destinations/${urlTourId}`,
          );
          const data = await response.json();

          if (data) {
            setFormData((prev) => ({
              ...prev,
              country: data.country || "",
              region: data.region
                ? data.region.charAt(0).toUpperCase() + data.region.slice(1)
                : "",
            }));
          }
        } catch (err) {
          console.error("Error fetching tour details:", err);
        }
      }
    };

    fetchTourDetails();
  }, [urlTourId, urlCountry, urlRegion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Flatpickr initialization
  useEffect(() => {
    const dateFromEl = dateFromRef.current;
    const dateToEl = dateToRef.current;

    const dateToInstance = flatpickr(dateToEl, {
      dateFormat: "Y-m-d",
      minDate: "today",
      allowInput: true,
      defaultDate: formData.dateTo || null,
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          setFormData((prev) => ({
            ...prev,
            dateTo: selectedDates[0].toISOString().split("T")[0],
          }));
        }
      },
    });

    const dateFromInstance = flatpickr(dateFromEl, {
      dateFormat: "Y-m-d",
      minDate: "today",
      allowInput: true,
      defaultDate: formData.dateFrom || null,
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          dateToInstance.set("minDate", selectedDates[0]);
          setFormData((prev) => ({
            ...prev,
            dateFrom: selectedDates[0].toISOString().split("T")[0],
          }));
        }
      },
    });

    return () => {
      if (dateFromInstance) dateFromInstance.destroy();
      if (dateToInstance) dateToInstance.destroy();
    };
  }, [formData.dateFrom, formData.dateTo]);

  useEffect(() => {
    if (formData.basePrice > 0) {
      let price = formData.basePrice * formData.numberOfPeople;

      if (formData.numberOfPeople >= 4) {
        price *= 0.9;
      }

      setTotalPrice(Math.round(price));
    }
  }, [formData.basePrice, formData.numberOfPeople]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.tourId) {
      setError("Please select a tour");
      return;
    }
    if (!formData.name || !formData.email || !formData.dateFrom) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tourId: formData.tourId,
            tourName: formData.tourName,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            region: formData.region,
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            numberOfPeople: formData.numberOfPeople,
            specialRequests: formData.specialRequests,
            basePrice: formData.basePrice,
            totalPrice: totalPrice,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className={styles.bookingContainer}>
      <div className={styles.bookingWrapper}>
        <h1>{urlTourId ? `Book ${formData.tourName}` : "Book Your Tour"}</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {!showPayment ? (
          <form onSubmit={handleSubmit} className={styles.bookingForm}>
            {formData.tourId && (
              <div className={styles.tourInfo}>
                <h3>{formData.tourName}</h3>
                <p>Base Price: ${formData.basePrice} per person</p>
              </div>
            )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                  readOnly={!!(urlCountry || (urlTourId && formData.country))}
                  style={{
                    backgroundColor:
                      urlCountry || (urlTourId && formData.country)
                        ? "#f5f5f5"
                        : "white",
                    cursor:
                      urlCountry || (urlTourId && formData.country)
                        ? "not-allowed"
                        : "text",
                  }}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                readOnly={!!(urlRegion || (urlTourId && formData.region))}
                style={{
                  backgroundColor:
                    urlRegion || (urlTourId && formData.region)
                      ? "#f5f5f5"
                      : "white",
                  cursor:
                    urlRegion || (urlTourId && formData.region)
                      ? "not-allowed"
                      : "text",
                }}
              />
            </div>

            {/* FLATPICKR */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Start Date *</label>
                <div className={styles.dateInputWrapper}>
                  <input
                    ref={dateFromRef}
                    type="text"
                    placeholder="Select date"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>End Date</label>
                <div className={styles.dateInputWrapper}>
                  <input
                    ref={dateToRef}
                    type="text"
                    placeholder="Select date"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Number of People *</label>
              <select
                value={formData.numberOfPeople}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfPeople: Number(e.target.value),
                  })
                }
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "Person" : "People"}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Special Requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) =>
                  setFormData({ ...formData, specialRequests: e.target.value })
                }
                rows="4"
                placeholder="Dietary requirements, accessibility needs, etc."
              />
            </div>

            {formData.basePrice > 0 && (
              <div className={styles.priceSummary}>
                <h3>Price Summary</h3>
                <div className={styles.priceRow}>
                  <span>Base Price × {formData.numberOfPeople} people</span>
                  <span>${formData.basePrice * formData.numberOfPeople}</span>
                </div>

                {formData.numberOfPeople >= 4 && (
                  <div className={`${styles.priceRow} ${styles.discount}`}>
                    <span>Group Discount (10%)</span>
                    <span>
                      -$
                      {Math.round(
                        formData.basePrice * formData.numberOfPeople * 0.1,
                      )}
                    </span>
                  </div>
                )}

                <hr />

                <div className={`${styles.priceRow} ${styles.total}`}>
                  <span>Total Amount</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={!formData.tourId}
            >
              Proceed to Payment →
            </button>
          </form>
        ) : (
          <div className={styles.paymentConfirmation}>
            <h2>Confirm Your Booking</h2>

            <div className={styles.confirmationDetails}>
              <div className={styles.detailRow}>
                <strong>Tour:</strong>
                <span>{formData.tourName}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Date:</strong>
                <span>
                  {formData.dateFrom}{" "}
                  {formData.dateTo && `to ${formData.dateTo}`}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Guests:</strong>
                <span>{formData.numberOfPeople} people</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Name:</strong>
                <span>{formData.name}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Email:</strong>
                <span>{formData.email}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Location:</strong>
                <span>
                  {formData.region ? `${formData.region}, ` : ""}
                  {formData.country}
                </span>
              </div>

              <hr />

              <div className={styles.totalAmount}>
                <strong>Total Amount:</strong>
                <span className={styles.amount}>${totalPrice}</span>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={() => setShowPayment(false)}
                className={styles.btnSecondary}
                disabled={loading}
              >
                ← Back to Edit
              </button>

              <button
                onClick={handlePayment}
                className={styles.btnPrimary}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay Now with Stripe 💳"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
