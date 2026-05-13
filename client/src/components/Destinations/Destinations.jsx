import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Destinations.module.css";
import { API_URL } from "../../config";
function Destinations() {
  const [filter, setFilter] = useState("all");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash && !loading && destinations.length > 0) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, [hash, loading, destinations]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/destinations`);
        const data = await response.json();
        setDestinations(data);
      } catch (err) {
        console.error("Destinations could not be loaded:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const userData = await res.json();
          setUserFavorites(
            userData.favorites.map((f) => (typeof f === "object" ? f._id : f)),
          );
        }
      } catch (err) {
        console.error("Fav fetch error:", err);
      }
    };

    fetchDestinations();
    fetchUserFavorites();
  }, []);

  const handleToggleFavorite = async (tourId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add favorites!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/favorite/${tourId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const updatedFavIds = await response.json();
        setUserFavorites(updatedFavIds);
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  const filteredItems =
    filter === "all"
      ? destinations
      : destinations.filter(
          (item) => item.region.toLowerCase() === filter.toLowerCase(),
        );

  if (loading) {
    return (
      <main className={styles.mainContent}>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>Loading destinations...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <section className={styles.destinationsHeroSection}>
        <div className={styles.heroContent}>
          <h1>Explore Our Destinations</h1>
          <p>
            Discover amazing places around the world waiting for your visit.
          </p>
        </div>
      </section>

      <section className={styles.filterSection}>
        <div className={styles.filterButtons}>
          {["all", "asia", "europe", "americas", "africa", "oceania"].map(
            (cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${
                  filter === cat ? styles.active : ""
                }`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ),
          )}
        </div>
      </section>

      <section className={styles.destinationsCardsSection}>
        <div className={`${styles.destinationsGrid} ${styles.container}`}>
          {filteredItems.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                gridColumn: "1 / -1",
                padding: "40px",
              }}
            >
              No destinations found in this category.
            </p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item._id}
                id={item._id}
                className={styles.destinationCard}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.cardImg}
                    loading="lazy"
                    decoding="async"
                  />

                  <button
                    className={`${styles.favoriteBtn} ${
                      userFavorites.includes(item._id) ? styles.isFavorite : ""
                    }`}
                    onClick={() => handleToggleFavorite(item._id)}
                    type="button"
                  >
                    {userFavorites.includes(item._id) ? "❤️" : "🤍"}
                  </button>

                  <span className={styles.locationTag}>
                    {item.region.charAt(0).toUpperCase() + item.region.slice(1)}
                  </span>
                  {item.duration && (
                    <span className={styles.durationTag}>{item.duration}</span>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <h3>{item.name}</h3>
                  <p className={styles.description}>{item.description}</p>
                  <div className={styles.priceInfo}>
                    <div className={styles.priceDetails}>
                      <span className={styles.price}>From ${item.price}</span>
                      <span className={styles.perPerson}>per person</span>
                    </div>
                    <Link
                      to={`/booking?tourId=${
                        item._id
                      }&tourName=${encodeURIComponent(item.name)}&basePrice=${
                        item.price
                      }`}
                      className={styles.bookBtn}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Destinations;
