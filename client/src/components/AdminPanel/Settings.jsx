import React, { useState } from "react";
import styles from "./AdminPanel.module.css";
import { API_URL } from "../../config";
const Settings = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      return setMessage({
        type: "error",
        text: "The new passwords don't match!",
      });
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Your information has been successfully updated.",
        });
        setFormData({
          ...formData,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      console.error("An error occurred during the update:", err);
      setMessage({ type: "error", text: "An error occurred!" });
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h2>Account Settings</h2>
      <p className={styles.settingsSubtext}>
        Manage your profile information and security here.
      </p>

      {message.text && (
        <div
          className={
            message.type === "success" ? styles.successAlert : styles.errorAlert
          }
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.settingsGroup}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            className={styles.settingsInput}
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your new email address."
          />
        </div>

        <div className={styles.settingsDivider}></div>

        <div className={styles.settingsGroup}>
          <label>Current Password</label>
          <input
            type="password"
            name="oldPassword"
            className={styles.settingsInput}
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Your password is required to save the changes."
            required={formData.newPassword !== "" || formData.email !== ""}
          />
        </div>

        <div className={styles.settingsGroup}>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            className={styles.settingsInput}
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Leave it blank if you don't want to change it."
          />
        </div>

        <div className={styles.settingsGroup}>
          <label>New Password (Again)</label>
          <input
            type="password"
            name="confirmPassword"
            className={styles.settingsInput}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm the new password."
          />
        </div>

        <button type="submit" className={styles.settingsSubmitBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
