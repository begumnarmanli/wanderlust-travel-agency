import React, { useState, useEffect } from "react";
import styles from "./DestinationsManager.module.css";
import { API_URL } from "../../config";
const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Users could not be loaded:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        alert("Authorization updated.");
        fetchUsers();
      }
    } catch (err) {
      console.error("Role update error:", err);
      alert(
        "An error occurred while updating the authorization. Please try again.",
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Deletion error:", err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>User Management</h2>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={
                      user.role === "admin"
                        ? styles.featuredYes
                        : styles.featuredNo
                    }
                  >
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    {user.role === "user" ? (
                      <button
                        onClick={() => handleRoleChange(user._id, "admin")}
                        className={styles.editBtn}
                        title="Make Admin"
                      >
                        <i className="fas fa-user-shield"></i>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user._id, "user")}
                        className={styles.cancelBtn}
                        style={{ padding: "5px 10px" }}
                        title="Demote to User"
                      >
                        <i className="fas fa-user"></i>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className={styles.deleteBtn}
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
    </div>
  );
};

export default UsersManager;
