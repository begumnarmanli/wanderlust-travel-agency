import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import styles from "./Contact.module.css";
import { API_URL } from "../../config";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaInfoCircle,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
const Contact = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);

  const [globalContactInfo, setGlobalContactInfo] = useState({});
  const [regions, setRegions] = useState([]);
  const [selectedContactRegion, setSelectedContactRegion] = useState(null);

  const [availableRegions, setAvailableRegions] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);

  const [region, setRegion] = useState(() => {
    return urlParams.get("region")?.toLowerCase() || "";
  });

  const [country, setCountry] = useState(() => {
    const dest = urlParams.get("destination");
    if (!dest) return "";

    const decoded = decodeURIComponent(dest);
    return decoded
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const regionRef = useRef(null);
  const countryRef = useRef(null);

  const initialDest = urlParams.get("destination");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchContactData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/contact`);
        const data = await res.json();

        const actualData = Array.isArray(data) ? data[0] : data;

        if (actualData) {
          const {
            _id,
            __v,
            updatedAt: _u,
            createdAt: _c,
            regions: apiRegions,
            ...pureData
          } = actualData;

          setGlobalContactInfo(pureData);

          if (apiRegions && Array.isArray(apiRegions)) {
            setRegions(apiRegions);
          }
        }
      } catch (err) {
        console.error("Error fetching contact info:", err);
      }
    };

    const fetchDestinations = async () => {
      try {
        const res = await fetch(`${API_URL}/api/destinations`);
        const data = await res.json();

        if (data && Array.isArray(data)) {
          setAllDestinations(data);

          const uniqueRegions = [...new Set(data.map((d) => d.region))].filter(
            Boolean,
          );
          setAvailableRegions(uniqueRegions);

          const countriesWithRegion = data.map((d) => ({
            name: d.country,
            region: d.region,
          }));

          const uniqueCountries = countriesWithRegion.reduce((acc, curr) => {
            if (
              !acc.find((c) => c.name === curr.name && c.region === curr.region)
            ) {
              acc.push(curr);
            }
            return acc;
          }, []);

          setAvailableCountries(uniqueCountries);
        }
      } catch (err) {
        console.error("Error fetching destinations:", err);
      }
    };

    fetchContactData();
    fetchDestinations();

    const dateToInstance = flatpickr("#travel_date_to", {
      dateFormat: "Y-m-d",
      minDate: "today",
      allowInput: true,
      disableMobile: true,
    });

    flatpickr("#travel_date_from", {
      dateFormat: "Y-m-d",
      minDate: "today",
      allowInput: true,
      disableMobile: true,
      onChange: (selectedDates) => {
        if (selectedDates[0]) dateToInstance.set("minDate", selectedDates[0]);
      },
    });

    const handleOutsideClick = (e) => {
      if (regionRef.current && !regionRef.current.contains(e.target)) {
        setIsRegionOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setIsCountryOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    if (initialDest) {
      setTimeout(() => {
        document
          .getElementById("booking-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [initialDest]);

  const handleRegionSelect = (e, regionName) => {
    e.stopPropagation();
    setRegion(regionName);
    setCountry("");
    setIsRegionOpen(false);
  };

  const handleCountrySelect = (e, countryObj) => {
    e.stopPropagation();
    setCountry(countryObj.name);
    setRegion(countryObj.region);
    setIsCountryOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    const formData = new FormData(e.target);
    const destination = allDestinations.find(
      (dest) => dest.country === country && dest.region === region,
    );

    if (!destination) {
      setSubmitMessage({
        type: "error",
        text: "Selected destination not found. Please select a valid country.",
      });
      setIsSubmitting(false);
      return;
    }

    const bookingParams = new URLSearchParams({
      tourId: destination._id,
      tourName: destination.name,
      basePrice: destination.price,

      name: formData.get("full_name"),
      email: formData.get("email"),
      country: country,
      region: region.charAt(0).toUpperCase() + region.slice(1),
      dateFrom: formData.get("date_from"),
      dateTo: formData.get("date_to"),
      numberOfPeople: formData.get("travelers"),
      specialRequests: formData.get("special_requests") || "",
    });

    navigate(`/booking?${bookingParams.toString()}`);
    setIsSubmitting(false);
  };

  const activeContactInfo = selectedContactRegion
    ? regions.find((r) => r._id === selectedContactRegion)?.contactDetails || {}
    : globalContactInfo;

  const getIcon = (key) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes("phone") || lowerKey.includes("tel")) {
      return <FaPhone />;
    } else if (lowerKey.includes("mail")) {
      return <FaEnvelope />;
    } else if (lowerKey.includes("address") || lowerKey.includes("adres")) {
      return <FaMapMarkerAlt />;
    } else if (lowerKey.includes("hour") || lowerKey.includes("saat")) {
      return <FaClock />;
    } else if (lowerKey.includes("whatsapp")) {
      return <FaWhatsapp />;
    } else if (lowerKey.includes("instagram")) {
      return <FaInstagram />;
    } else if (lowerKey.includes("facebook")) {
      return <FaFacebookF />;
    } else if (lowerKey.includes("twitter") || lowerKey.includes("x")) {
      return <FaXTwitter />;}

    return <FaInfoCircle />;
  };

  const filteredCountries = region
    ? availableCountries.filter((c) => c.region === region)
    : availableCountries;

  return (
    <main>
      <section className={styles["contact-hero-section"]}>
        <div className={styles.container}>
          <h1>Let's Plan Your Journey</h1>
          <p>Fill out the form and we'll contact you within 24 hours</p>
        </div>
      </section>

      <section className={styles["contact-form-section"]}>
        <div className={`${styles.container} ${styles["contact-grid"]}`}>
          <div className={styles["contact-info-panel"]}>
            <h2>Ready to Start Your Adventure?</h2>
            <p>
              Our travel experts are here to help you create the perfect
              itinerary.
            </p>

            <div className={styles["region-tabs"]}>
              <button
                className={`${styles["region-tab"]} ${
                  !selectedContactRegion ? styles.active : ""
                }`}
                onClick={() => setSelectedContactRegion(null)}
              >
                <i className="fas fa-globe"></i>
                Global Office
              </button>
              {regions.map((reg) => (
                <button
                  key={reg._id}
                  className={`${styles["region-tab"]} ${
                    selectedContactRegion === reg._id ? styles.active : ""
                  }`}
                  onClick={() => setSelectedContactRegion(reg._id)}
                >
                  <i className="fas fa-map-marker-alt"></i>
                  {reg.regionName}
                </button>
              ))}
            </div>

            <div className={styles["contact-details"]}>
              {Object.entries(activeContactInfo).map(([key, value]) => {
                if (["_id", "__v"].includes(key) || !value || value === "#")
                  return null;
                if (typeof value === "object") return null;

                const lowerKey = key.toLowerCase();
                if (
                  ["instagram", "facebook", "twitter", "x"].includes(lowerKey)
                )
                  return null;

                const icon = getIcon(key);

                return (
                  <div className={styles["info-item"]} key={key}>
                    <div className={styles["info-header"]}>
                      {icon}
                      <strong>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </strong>
                    </div>
                    <p>{String(value)}</p>
                  </div>
                );
              })}
            </div>

            <div className={styles["social-links"]}>
              <strong>Follow Us</strong>
              <div className={styles["social-icons"]}>
                {Object.entries(activeContactInfo).map(([key, value]) => {
                  const lowerKey = key.toLowerCase();

                  if (typeof value === "object") return null;

                  if (
                    value &&
                    value !== "#" &&
                    ["instagram", "facebook", "twitter", "x", "whatsapp"].some(
                      (s) => lowerKey.includes(s),
                    )
                  ) {
                    let iconName = lowerKey.includes("instagram")
                      ? "instagram"
                      : lowerKey.includes("facebook")
                        ? "facebook"
                        : lowerKey.includes("whatsapp")
                          ? "whatsapp"
                          : "x-twitter";

                    return (
                      <a
                        key={key}
                        href={
                          value.startsWith("http") ? value : `https://${value}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className={styles["social-icon"]}
                      >
                        {iconName === "instagram" && <FaInstagram />}
                        {iconName === "facebook" && <FaFacebookF />}
                        {iconName === "whatsapp" && <FaWhatsapp />}
                        {iconName === "x-twitter" && <FaXTwitter />}
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          <div
            className={styles["reservation-form-panel"]}
            id="booking-section"
          >
            <h2 className={styles["form-title"]}>Reservation Request</h2>

            {submitMessage.text && (
              <div
                className={
                  submitMessage.type === "success"
                    ? styles["success-message"]
                    : styles["error-message"]
                }
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                  backgroundColor:
                    submitMessage.type === "success" ? "#d4edda" : "#f8d7da",
                  color:
                    submitMessage.type === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${
                    submitMessage.type === "success" ? "#c3e6cb" : "#f5c6cb"
                  }`,
                }}
              >
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className={`${styles["form-group"]} ${styles["form-row"]}`}>
                <div
                  ref={regionRef}
                  className={`${styles["form-col"]} ${styles["custom-select"]}`}
                >
                  <label>Preferred Region *</label>
                  <div
                    className={`${styles["select-trigger"]} ${
                      isRegionOpen ? styles.active : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRegionOpen(!isRegionOpen);
                      setIsCountryOpen(false);
                    }}
                  >
                    <span className={styles["select-text"]}>
                      {region
                        ? region.charAt(0).toUpperCase() + region.slice(1)
                        : "Select Region"}
                    </span>
                    <span className={styles["select-arrow"]}></span>
                  </div>
                  <ul
                    className={`${styles["select-options"]} ${
                      isRegionOpen ? styles.show : ""
                    }`}
                  >
                    {availableRegions.map((reg) => (
                      <li key={reg} onClick={(e) => handleRegionSelect(e, reg)}>
                        {reg.charAt(0).toUpperCase() + reg.slice(1)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  ref={countryRef}
                  className={`${styles["form-col"]} ${styles["custom-select"]}`}
                >
                  <label>Select Country *</label>
                  <div
                    className={`${styles["select-trigger"]} ${
                      isCountryOpen ? styles.active : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCountryOpen(!isCountryOpen);
                      setIsRegionOpen(false);
                    }}
                  >
                    <span className={styles["select-text"]}>
                      {country || "Select Country"}
                    </span>
                    <span className={styles["select-arrow"]}></span>
                  </div>
                  <ul
                    className={`${styles["select-options"]} ${
                      isCountryOpen ? styles.show : ""
                    }`}
                  >
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((countryObj, index) => (
                        <li
                          key={`${countryObj.name}-${index}`}
                          onClick={(e) => handleCountrySelect(e, countryObj)}
                        >
                          {countryObj.name}
                        </li>
                      ))
                    ) : (
                      <li style={{ color: "#999", pointerEvents: "none" }}>
                        {region
                          ? "No countries available for this region"
                          : "Select a region first"}
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-col"]}>
                  <div className={styles["form-group"]}>
                    <label>Travel Date (From) *</label>
                    <div className={styles["date-input-wrapper"]}>
                      <input
                        type="text"
                        id="travel_date_from"
                        name="date_from"
                        placeholder="dd/mm/yyyy"
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className={styles["form-col"]}>
                  <div className={styles["form-group"]}>
                    <label>Travel Date (To) *</label>
                    <div className={styles["date-input-wrapper"]}>
                      <input
                        type="text"
                        id="travel_date_to"
                        name="date_to"
                        placeholder="dd/mm/yyyy"
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles["form-group"]}>
                <label>Number of Travelers</label>
                <input
                  type="number"
                  name="travelers"
                  defaultValue="1"
                  min="1"
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Special Requests</label>
                <textarea
                  name="special_requests"
                  maxLength="500"
                  rows="3"
                  onChange={(e) => setCharCount(e.target.value.length)}
                  placeholder="Tell us about special occasions..."
                ></textarea>
                <small className={styles["char-count"]}>
                  {charCount}/500 characters
                </small>
              </div>

              <button
                type="submit"
                className={styles["submit-btn"]}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue to Booking →"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
