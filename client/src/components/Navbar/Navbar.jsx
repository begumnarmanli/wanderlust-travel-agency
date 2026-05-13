import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutModal from "../LogoutModal/LogoutModal.jsx";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("role"));
      setUserName(localStorage.getItem("userName") || "User");
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("profileUpdate", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("profileUpdate", checkAuth);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName("User");

    setIsOpen(false);
    setShowLogoutModal(false);
    document.body.classList.remove("menu-open");
    navigate("/");
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <NavLink to="/" className={styles.logo}>
            <img src="/images/logo.webp" alt="Logo" />
            <span>Wanderlust</span>
          </NavLink>

          <button className={styles.menuToggle} onClick={toggleMenu}>
            <span className={styles.hamburgerIcon}></span>
          </button>

          <nav className={`${styles.nav} ${isOpen ? styles.open : ""}`}>
            <NavLink
              to="/"
              className={getNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/destinations"
              className={getNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Destinations
            </NavLink>
            <NavLink
              to="/about"
              className={getNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={getNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  className={styles.navUser}
                  onClick={() => setIsOpen(false)}
                >
                  <span>My Profile ({userName})</span>
                </NavLink>

                {userRole === "admin" && (
                  <NavLink
                    to="/admin"
                    className={getNavLinkClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </NavLink>
                )}

                <button
                  className={`${styles.navLink} ${styles.logoutBtn}`}
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={getNavLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={`${styles.navLink} ${styles.registerBtn}`}
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default Navbar;
