import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Register.module.css";
import { API_URL } from "../../config";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can log in now.");
        navigate("/login");
      } else {
        alert(data.message || "An error occurred during registration.");
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  return (
    <div className={styles.registerPage}>
      <header className={styles.registerHeader}>
        <div className={styles.registerNavContainer}>
          <div className={styles.registerLogo}>
            <img src="/images/logo.webp" alt="Logo" />
            <span>Wanderlust</span>
          </div>
        </div>
      </header>

      <div className={styles.registerContainer}>
        <div className={styles.registerBox}>
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <h2>Create an Account</h2>
            <p className={styles.registerSubtitle}>
              Join us to start your journey
            </p>

            <div className={styles.registerFormGroup}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.registerFormGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.registerFormGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className={styles.registerBtn}>
              Register
            </button>

            <p className={styles.signupLink}>
              Do you already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
