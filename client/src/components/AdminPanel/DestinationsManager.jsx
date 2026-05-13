import React, { useState, useEffect, useRef } from "react";
import styles from "./DestinationsManager.module.css";
import { API_URL } from "../../config";
const DestinationsManager = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    country: "",
    description: "",
    price: "",
    image: "",
    featured: false,
    duration: "7 days",
    features: "",
    order: 0,
  });

  const regionDropdownRef = useRef(null);

  const regions = [
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia" },
    { value: "americas", label: "Americas" },
    { value: "africa", label: "Africa" },
    { value: "oceania", label: "Oceania" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        regionDropdownRef.current &&
        !regionDropdownRef.current.contains(event.target)
      ) {
        setIsRegionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/destinations`);
      const data = await response.json();
      const sortedData = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setDestinations(sortedData);
    } catch (err) {
      console.error("Destinations could not be loaded:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (destination, direction) => {
    const token = localStorage.getItem("token");
    const currentOrder = destination.order || 0;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    try {
      const response = await fetch(
        `${API_URL}/api/destinations/${destination._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...destination, order: newOrder }),
        },
      );

      if (response.ok) {
        fetchDestinations();
      }
    } catch (err) {
      console.error("The ranking could not be updated:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "price") {
      const cleanValue = value.replace(/[^0-9,.]/g, "");
      setFormData({
        ...formData,
        [name]: cleanValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleRegionSelect = (value) => {
    setFormData({
      ...formData,
      region: value,
    });
    setIsRegionDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const featuresArray = formData.features
      ? formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f)
      : [];

    const cleanPrice = parseFloat(formData.price.replace(/,/g, "")) || 0;

    const dataToSend = {
      ...formData,
      price: cleanPrice,
      features: featuresArray,
      order: editingId ? formData.order : destinations.length + 1,
    };

    try {
      const url = editingId
        ? `${API_URL}/api/destinations/${editingId}`
        : `${API_URL}/api/destinations`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchDestinations();
        resetForm();
      } else {
        alert("Hata: " + data.message);
      }
    } catch (err) {
      console.error("Operation error:", err);
      alert("An error occurred!");
    }
  };

  const handleEdit = (destination) => {
    let priceValue = destination.price;
    if (typeof priceValue === "number" && !isNaN(priceValue)) {
      priceValue = priceValue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    } else {
      priceValue = String(priceValue || "");
    }

    setFormData({
      name: destination.name || "",
      region: destination.region || "",
      country: destination.country || "",
      description: destination.description || "",
      price: priceValue,
      image: destination.image || "",
      featured: destination.featured || false,
      duration: destination.duration || "7 days",
      features: destination.features ? destination.features.join(", ") : "",
      order: destination.order || 0,
    });

    setEditingId(destination._id);
    setShowForm(true);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/destinations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Destination deleted successfully");
        fetchDestinations();
      } else {
        alert("Failed to delete destination");
      }
    } catch (err) {
      console.error("Deletion error:", err);
      alert("An error occurred!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      region: "",
      country: "",
      description: "",
      price: "",
      image: "",
      featured: false,
      duration: "7 days",
      features: "",
      order: 0,
    });
    setEditingId(null);
    setShowForm(false);
    setIsRegionDropdownOpen(false);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Destinations Management</h2>
        <button
          className={styles.addBtn}
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          <i className="fas fa-plus"></i>
          {showForm ? "Cancel" : "Add New Destination"}
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3>{editingId ? "Edit Destination" : "Add New Destination"}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Destination Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Region *</label>
                <div className={styles.customDropdown} ref={regionDropdownRef}>
                  <div
                    className={`${styles.dropdownHeader} ${
                      isRegionDropdownOpen ? styles.open : ""
                    }`}
                    onClick={() =>
                      setIsRegionDropdownOpen(!isRegionDropdownOpen)
                    }
                  >
                    <span
                      className={
                        formData.region ? styles.selected : styles.placeholder
                      }
                    >
                      {formData.region
                        ? regions.find((r) => r.value === formData.region)
                            ?.label
                        : "Select Region"}
                    </span>
                    <i
                      className={`fas fa-chevron-down ${styles.dropdownIcon} ${
                        isRegionDropdownOpen ? styles.rotate : ""
                      }`}
                    ></i>
                  </div>

                  {isRegionDropdownOpen && (
                    <div className={styles.dropdownList}>
                      {regions.map((region) => (
                        <div
                          key={region.value}
                          className={`${styles.dropdownItem} ${
                            formData.region === region.value
                              ? styles.active
                              : ""
                          }`}
                          onClick={() => handleRegionSelect(region.value)}
                        >
                          <span>{region.label}</span>
                          {formData.region === region.value && (
                            <i className="fas fa-check"></i>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price (USD) *</label>
                <input
                  type="text"
                  name="price"
                  placeholder="e.g., 1,799.58"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
                <small
                  style={{
                    color: "#666",
                    fontSize: "0.85rem",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  Use commas for thousands and period for decimals
                </small>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Duration *</label>
              <input
                type="text"
                name="duration"
                placeholder="e.g., 7 days"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Features (comma separated)</label>
              <input
                type="text"
                name="features"
                placeholder="Beach, Culture, Adventure"
                value={formData.features}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Image URL *</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className={styles.imagePreview}
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                <span>Feature on homepage</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={resetForm}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                {editingId ? "Update Destination" : "Add Destination"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Region</th>
              <th>Price</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No destinations found. Click "Add New Destination" to create
                  one.
                </td>
              </tr>
            ) : (
              destinations.map((dest) => (
                <tr key={dest._id}>
                  <td>
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className={styles.thumbnail}
                    />
                  </td>
                  <td>
                    <strong>{dest.name}</strong>
                    <br />
                    <small>{dest.country}</small>
                  </td>
                  <td>
                    <span className={styles.regionBadge}>{dest.region}</span>
                  </td>
                  <td>
                    $
                    {typeof dest.price === "number"
                      ? dest.price.toLocaleString("en-US")
                      : dest.price}
                  </td>
                  <td>
                    <div className={styles.orderActions}>
                      <button
                        onClick={() => updateOrder(dest, "up")}
                        className={styles.orderBtn}
                        title="Move up"
                      >
                        <i className="fas fa-chevron-up"></i>
                      </button>
                      <button
                        onClick={() => updateOrder(dest, "down")}
                        className={styles.orderBtn}
                        title="Move down"
                      >
                        <i className="fas fa-chevron-down"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(dest)}
                        title="Edit destination"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(dest._id)}
                        title="Delete destination"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DestinationsManager;
