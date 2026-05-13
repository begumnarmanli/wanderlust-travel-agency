import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import styles from "./BookingSuccess.module.css";

function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [sessionId]);

  if (loading) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successWrapper}>
          <div className={styles.loader}>Processing your payment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.successContainer}>
      <div className={styles.successWrapper}>
        <div className={styles.successIcon}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#27ae60" strokeWidth="2" />
            <path
              d="M8 12L11 15L16 9"
              stroke="#27ae60"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1>🎉 Booking Confirmed!</h1>
        <p className={styles.subtitle}>Your payment was successful</p>

        <div className={styles.infoBox}>
          <h3>What happens next?</h3>
          <ul>
            <li>✅ You'll receive a confirmation email shortly</li>
            <li>📧 Check your inbox for booking details</li>
            <li>📞 We'll contact you 24-48 hours before your tour</li>
            <li>🎒 Get ready for an amazing adventure!</li>
          </ul>
        </div>

        {sessionId && (
          <div className={styles.sessionInfo}>
            <p>
              Booking Reference: <strong>{sessionId.slice(-12)}</strong>
            </p>
          </div>
        )}

        <div className={styles.buttonGroup}>
          <Link to="/" className={styles.btnPrimary}>
            Back to Home
          </Link>
          <Link to="/destinations" className={styles.btnSecondary}>
            Browse More Tours
          </Link>
        </div>

        <div className={styles.supportInfo}>
          <p>Need help? Contact us at:</p>
          <a href="mailto:info@wanderlust.com">info@wanderlust.com</a>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
