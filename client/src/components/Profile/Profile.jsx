import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css";
import { API_URL } from "../../config";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({ userName: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState({ c: false, n: false, conf: false });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditData({
          userName: data.userName || data.fullName || "",
        });
      }

      const reservationsResponse = await fetch(
        `${API_URL}/api/reservations/my-reservations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        setReservations(reservationsData);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    window.addEventListener("profileUpdate", fetchProfile);
    return () => window.removeEventListener("profileUpdate", fetchProfile);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editData.userName,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({ ...user, ...updatedUser, userName: updatedUser.fullName });
        localStorage.setItem("userName", updatedUser.fullName);
        window.dispatchEvent(new Event("profileUpdate"));
        setIsModalOpen(false);
        alert("Changes saved!");
      } else {
        const error = await response.json();
        alert(error.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error: " + err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm)
      return alert("Passwords don't match!");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      if (res.ok) {
        alert("Password updated!");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        const d = await res.json();
        alert(d.message || "Error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loader}>Loading...</div>;
  if (!user)
    return (
      <div className={styles.error}>User not found. Please login again.</div>
    );
  const handleCancel = async (bookingId, paymentStatus) => {
    const confirmMsg =
      paymentStatus === "paid"
        ? "This reservation has been paid for. If you cancel, the refund process will begin. Are you sure?"
        : "Are you sure you want to cancel this reservation?";

    if (window.confirm(confirmMsg)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/api/reservations/cancel/${bookingId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          alert("Your cancellation request has been successfully processed.");
          fetchProfile();
        } else {
          const errData = await response.json();
          alert(errData.message || "Cancellation failed.");
        }
      } catch (error) {
        console.error("Cancel error:", error);
        alert("An error occurred.");
      }
    }
  };
  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div className={styles.profileGrid}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.userInitial}>
                <div className={styles.noImage}>
                  {user.userName?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3>{user.userName}</h3>
              <p className={styles.userRoleBadge}>
                {user.role?.toUpperCase() || "USER"}
              </p>
              <p className={styles.userEmail}>{user.email}</p>
              <button
                className={styles.editProfileBtn}
                onClick={() => setIsModalOpen(true)}
              >
                Account Settings
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className={styles.mainContent}>
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h3>My Favorite Tours</h3>
                <span className={styles.badge}>
                  {user.favorites?.length || 0}
                </span>
              </div>

              <div className={styles.favoritesGrid}>
                {user.favorites && user.favorites.length > 0 ? (
                  user.favorites.map((tour) => (
                    <div key={tour._id} className={styles.favCard}>
                      <div className={styles.favImageWrapper}>
                        <img src={tour.image} alt={tour.name} />
                      </div>

                      <div className={styles.favContent}>
                        <div className={styles.favInfoText}>
                          <h4>{tour.name}</h4>
                        </div>

                        <div className={styles.favPriceTag}>
                          <span>${tour.price}</span>
                        </div>

                        <Link
                          to={`/destinations#${tour._id}`}
                          className={styles.viewFavBtn}
                        >
                          View Tour
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>No favorite tours yet. Start exploring!</p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h3>My Bookings</h3>
                <span className={styles.badge}>{reservations.length}</span>
              </div>

              <div className={styles.bookingsList}>
                {reservations.length > 0 ? (
                  reservations.map((booking) => (
                    <div key={booking._id} className={styles.bookingCard}>
                      <div className={styles.bookingMainInfo}>
                        <h4>{booking.tourName}</h4>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(booking.dateFrom).toLocaleDateString()} -{" "}
                          {new Date(booking.dateTo).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Travelers:</strong> {booking.travelers}
                        </p>
                        <p>
                          <strong>Location:</strong> {booking.country},{" "}
                          {booking.region}
                        </p>
                      </div>
                      <div className={styles.bookingStatusSide}>
                        <div className={styles.statusBadges}>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[booking.status]
                            }`}
                          >
                            {booking.status.toUpperCase()}
                          </span>

                          <span
                            className={`${styles.paymentBadge} ${
                              booking.paymentStatus === "refunded"
                                ? styles.refunded
                                : styles[booking.paymentStatus]
                            }`}
                          >
                            {booking.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                        <p className={styles.totalPrice}>
                          Total: ${booking.totalPrice}
                        </p>

                        {booking.status !== "cancelled" &&
                          booking.status !== "completed" && (
                            <button
                              className={styles.cancelBookingBtn}
                              onClick={() =>
                                handleCancel(booking._id, booking.paymentStatus)
                              }
                            >
                              {booking.paymentStatus === "paid"
                                ? "Cancel & Refund"
                                : "Cancel Reservation"}
                            </button>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>No bookings yet. Plan your next adventure!</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen &&
        ReactDOM.createPortal(
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeModalX}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
              <h3>Edit Profile</h3>

              <form onSubmit={handleUpdate}>
                <div className={styles.formGroup}>
                  <label>User Name</label>
                  <input
                    type="text"
                    value={editData.userName}
                    onChange={(e) =>
                      setEditData({ ...editData, userName: e.target.value })
                    }
                    required
                  />
                </div>

                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </form>

              <hr className={styles.divider} />

              <form
                onSubmit={handlePasswordChange}
                className={styles.passwordForm}
              >
                <h4>Change Password</h4>
                {[
                  { label: "Current Password", key: "current", s: "c" },
                  { label: "New Password", key: "new", s: "n" },
                  { label: "Confirm Password", key: "confirm", s: "conf" },
                ].map((item) => (
                  <div className={styles.formGroup} key={item.key}>
                    <label>{item.label}</label>
                    <div className={styles.passInputWrapper}>
                      <input
                        type={showPass[item.s] ? "text" : "password"}
                        value={passwords[item.key]}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            [item.key]: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPass({
                            ...showPass,
                            [item.s]: !showPass[item.s],
                          })
                        }
                        className={styles.eyeBtn}
                      >
                        {showPass[item.s] ? "🔓" : "🔒"}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" className={styles.passwordBtn}>
                  Update Password
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Profile;
