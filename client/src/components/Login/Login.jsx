import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import { API_URL } from "../../config";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "user");

      // Email
      const finalEmail = data.userEmail || data.email || formData.email;
      localStorage.setItem("userEmail", finalEmail);

      // User Name
      const finalName = data.userName || data.name || finalEmail.split("@")[0];
      localStorage.setItem("userName", finalName);

      window.dispatchEvent(new Event("storage"));

      // Yönlendirme
      if (data.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError("Email or password is incorrect");
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.loginPage}>
      <header className={styles.loginHeader}>
        <div className={styles.loginNavContainer}>
          <div className={styles.loginLogo}>
            <img src="/images/logo.webp" alt="Logo" />
            <span>Wanderlust</span>
          </div>
        </div>
      </header>

      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <h2>Welcome Back</h2>
            <p className={styles.loginSubtitle}>
              Sign in to continue your journey
            </p>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className={styles.loginBtn}>
              Sign In
            </button>

            <p className={styles.signupLink}>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
          <div className={styles.backLinkContainer}>
            <p className={styles.backText}>
              Changed your mind?{" "}
              <span
                onClick={() => navigate("/")}
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                Go back to Home
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
