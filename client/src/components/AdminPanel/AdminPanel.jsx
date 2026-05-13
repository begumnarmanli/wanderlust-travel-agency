import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanel.module.css";
import LogoutModal from "../LogoutModal/LogoutModal";
import Dashboard from "./Dashboard";
import DestinationsManager from "./DestinationsManager";
import ContactInfoManager from "./ContactInfoManager";
import UsersManager from "./UsersManager";
import Settings from "./Settings";
import CustomSelect from "../CustomSelect/CustomSelect";
import { API_URL } from "../../config";
const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const count = data.filter((res) => res.status === "pending").length;
      setPendingCount(count);
    } catch (err) {
      console.error("Number drawing error:", err);
    }
  }, []);

  useEffect(() => {
    fetchPendingCount(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchPendingCount]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "fas fa-chart-line" },
    {
      id: "reservations",
      label: "Reservations",
      icon: "fas fa-calendar-check",
    },
    {
      id: "destinations",
      label: "Destinations",
      icon: "fas fa-map-marker-alt",
    },
    { id: "users", label: "Users", icon: "fas fa-users-cog" },
    { id: "contact", label: "Contact Info", icon: "fas fa-address-book" },
    { id: "settings", label: "Settings", icon: "fas fa-cog" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>
            Wanderlust <span>Admin</span>
          </h2>
        </div>
        <div className={styles.previewZone}>
          <button onClick={() => navigate("/")} className={styles.previewBtn}>
            <i className="fas fa-external-link-alt"></i> View Site
          </button>
        </div>
        <nav className={styles.navMenu}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${
                activeTab === item.id ? styles.active : ""
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
              {item.id === "reservations" && pendingCount > 0 && (
                <span className={styles.notificationBadge}>{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className={styles.logoutZone}>
          <button
            className={styles.logoutBtn}
            onClick={() => setShowLogoutModal(true)}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{menuItems.find((i) => i.id === activeTab).label}</h1>
          <div className={styles.adminProfile}>
            <span>Welcome, Admin</span>
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=random"
              alt="Admin"
            />
          </div>
        </header>

        <section className={styles.contentBody}>
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "reservations" && (
            <ReservationsTab onUpdateCount={fetchPendingCount} />
          )}
          {activeTab === "destinations" && <DestinationsManager />}
          {activeTab === "contact" && <ContactInfoManager />}
          {activeTab === "users" && <UsersManager />}
          {activeTab === "settings" && <Settings />}
        </section>
      </main>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

const ReservationsTab = ({ onUpdateCount }) => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const statusOptions = [
    { value: "all", label: "All Status", icon: "fas fa-filter" },
    { value: "pending", label: "Pending", icon: "fas fa-clock" },
    { value: "confirmed", label: "Confirmed", icon: "fas fa-check-circle" },
    { value: "cancelled", label: "Cancelled", icon: "fas fa-times-circle" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: "fas fa-sort-amount-down" },
    { value: "oldest", label: "Oldest First", icon: "fas fa-sort-amount-up" },
  ];

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setReservations(data);
      if (onUpdateCount) onUpdateCount();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...reservations];
    if (statusFilter !== "all")
      filtered = filtered.filter((r) => r.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q),
      );
    }
    filtered.sort((a, b) => {
      const d1 = new Date(a.createdAt);
      const d2 = new Date(b.createdAt);
      return sortOrder === "newest" ? d2 - d1 : d1 - d2;
    });
    setFilteredReservations(filtered);
  }, [reservations, statusFilter, searchQuery, sortOrder]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/reservations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
      fetchReservations();
      if (onUpdateCount) onUpdateCount();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/reservations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      fetchReservations();
      if (onUpdateCount) onUpdateCount();
    }
  };

  const getStatusCount = (status) =>
    reservations.filter((r) => r.status === status).length;

  const totalRevenue = reservations
    .filter((r) => r.paymentStatus?.toLowerCase() === "paid")
    .reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);

  return (
    <div className={styles["admin-panel"]}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total</div>
          <div className={styles.statValue}>{reservations.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Pending</div>
          <div className={`${styles.statValue} ${styles.colorWarning}`}>
            {getStatusCount("pending")}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Confirmed</div>
          <div className={`${styles.statValue} ${styles.colorSuccess}`}>
            {getStatusCount("confirmed")}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Revenue</div>
          <div className={`${styles.statValue} ${styles.colorSuccess}`}>
            $
            {totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <CustomSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by Status"
        />

        <CustomSelect
          options={sortOptions}
          value={sortOrder}
          onChange={setSortOrder}
          placeholder="Sort Order"
        />
      </div>

      {loading ? (
        <p className={styles.placeholder}>Loading...</p>
      ) : (
        <div className={styles["admin-table-wrapper"]}>
          <table className={styles["admin-table"]}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Tour Details</th>
                <th>Total Price</th>
                <th>Status & Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => (
                <tr key={res._id}>
                  <td>
                    <div className={styles.customerName}>{res.name}</div>
                    <div className={styles.customerEmail}>{res.email}</div>
                  </td>
                  <td>
                    <div className={styles.tourNameText}>
                      {res.tourName || res.country}
                    </div>
                    <div className={styles.regionText}>{res.region}</div>
                  </td>
                  <td className={styles.priceText}>
                    {res.totalPrice
                      ? `$${res.totalPrice.toLocaleString()}`
                      : "-"}
                  </td>
                  <td>
                    <div className={styles.statusGroup}>
                      <span
                        className={`${styles.badge} ${
                          res.paymentStatus === "paid"
                            ? styles.paid
                            : styles.unpaid
                        }`}
                      >
                        {res.paymentStatus?.toLowerCase() === "paid"
                          ? "Paid"
                          : "Unpaid"}
                      </span>
                      <select
                        value={res.status}
                        onChange={(e) =>
                          handleStatusChange(res._id, e.target.value)
                        }
                        className={styles.statusSelect}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className={styles.orderActionsContainer}>
                      <button
                        onClick={() => {
                          setSelectedReservation(res);
                          setShowModal(true);
                        }}
                        className={styles.iconBtnView}
                      >
                        <i className="fas fa-expand-alt"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(res._id)}
                        className={styles.iconBtnDelete}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => {
            setShowModal(false);
            setSelectedReservation(null);
          }}
          onUpdate={fetchReservations}
        />
      )}
    </div>
  );
};

const ReservationDetailModal = ({ reservation, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(reservation.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/reservations/${reservation._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notes,
      }),
    });
    onUpdate();
    onClose();
    setSaving(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Reservation Details</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.settingsGroup}>
            <label>Customer: {reservation.name}</label>
            <label>Email: {reservation.email}</label>
            <label>
              Destination: {reservation.country}, {reservation.region}
            </label>
          </div>
          <div className={styles.settingsGroup}>
            <label>Admin Notes:</label>
            <textarea
              className={styles.settingsInput}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
            />
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles.saveActionButton}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
