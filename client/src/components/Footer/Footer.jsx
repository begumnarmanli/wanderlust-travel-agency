import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col logo-col">
          <img
            src="/images/logo.webp"
            alt="Wanderlust Travels Logo"
            className="footer-logo"
          />
          <p>
            Creating Memories Since 2010. Your trusted partner for unforgettable
            experiences around the world.
          </p>
        </div>

        <div className="footer-col links-col">
          <h3>Destinations</h3>
          <ul>
            <li>
              <Link to="/destinations?region=asia">Asia</Link>
            </li>
            <li>
              <Link to="/destinations?region=europe">Europe</Link>
            </li>
            <li>
              <Link to="/destinations?region=americas">Americas</Link>
            </li>
            <li>
              <Link to="/destinations?region=africa">Africa</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col links-col">
          <h3>Company</h3>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <a href="#team">Our Team</a>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
          </ul>
        </div>

        <div className="footer-col contact-col">
          <h3>Contact Us</h3>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <span>hello@wanderlusttravels.com</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>123 Travel Street, New York, NY</span>
          </div>

          <div className="social-icons">
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-credit">
          © 2025 Designed & Developed by{" "}
          <span className="footer-name">Begüm Narmanlı</span>
        </p>
        <div className="bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
