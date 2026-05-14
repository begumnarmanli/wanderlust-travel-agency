import React, { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../Hero/Hero";
import {
  FaGlobe,
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaPlane,
  FaShip,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import styles from "./Home.module.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: '"The trip to Bali exceeded all expectations. Every detail was perfectly planned, and the local guides were exceptional. Wanderlust Travels made our dream vacation a reality!"',
      name: "Sarah Mitchell",
      location: "New York, USA",
      photo: "/images/sarah.webp",
      rating: "5.0",
    },
    {
      id: 2,
      text: '"Our Santorini honeymoon was absolutely magical. The accommodations were stunning and the personalized itinerary was perfect. We couldn\'t have asked for a better experience!"',
      name: "Michael Chen",
      location: "San Francisco, USA",
      photo: "/images/michael.webp",
      rating: "5.0",
    },
    {
      id: 3,
      text: '"Exploring Iceland with Wanderlust was the adventure of a lifetime. From the Northern Lights to the glaciers, every moment was breathtaking. Highly recommend!"',
      name: "Emma Rodriguez",
      location: "Miami, USA",
      photo: "/images/emma.webp",
      rating: "5.0",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  return (
    <main>
      <Hero />

      {/* POPULAR DESTINATIONS SECTION */}
      <section className={styles.destinationsBg} id="destinations-bg">
        <div className={styles.destinations} id="destinations">
          <div className={styles.popularDestination}>
            <p className={styles.destText}>POPULAR DESTINATIONS</p>
            <h2>Where Will You Go Next?</h2>
            <p className={styles.subTextPopular}>
              Hand-picked destinations offering unforgettable experiences
            </p>
          </div>

          <div className={styles.destinationsGrid}>
            {[
              {
                id: 1,
                name: "Bali, Indonesia",
                country: "Indonesia",
                price: "$1,299",
                img: "/images/bali-indonesia.webp",
                desc: "Tropical paradise with stunning beaches, ancient temples, and lush rice terraces.",
              },
              {
                id: 2,
                name: "Santorini, Greece",
                country: "Greece",
                price: "$1,899",
                img: "/images/santorini-greece.webp",
                desc: "Iconic white-washed buildings with blue domes overlooking the Aegean Sea.",
              },
              {
                id: 3,
                name: "Tokyo, Japan",
                country: "Japan",
                price: "$1,599",
                img: "/images/tokyo-japan.webp",
                desc: "A fascinating blend of ultra-modern cityscape and traditional temples.",
              },
              {
                id: 4,
                name: "Patagonia, Argentina",
                country: "Argentina",
                price: "$2,199",
                img: "/images/patagonia-argentina.webp",
                desc: "Dramatic mountain landscapes, pristine glaciers, and incredible wildlife.",
              },
              {
                id: 5,
                name: "Iceland",
                country: "Iceland",
                price: "$2,499",
                img: "/images/iceland.webp",
                desc: "Land of fire and ice featuring Northern Lights and geothermal hot springs.",
              },
              {
                id: 6,
                name: "Morocco",
                country: "Morocco",
                price: "$1,499",
                img: "/images/morocco.webp",
                desc: "Vibrant markets, stunning desert landscapes, and rich cultural heritage.",
              },
            ].map((dest) => (
              <div className={styles.card} key={dest.id}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src={dest.img}
                    alt={dest.name}
                    width="400"
                    height="300"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.countryTag}>
                    <FaLocationDot /> {dest.country}
                  </span>
                </div>
                <div className={styles.cardContent}>
                  <h3>{dest.name}</h3>
                  <p className={styles.description}>{dest.desc}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.priceGroup}>
                      <span className={styles.price}>From {dest.price}</span>
                      <span className={styles.perPerson}>per person</span>
                    </div>
                    <Link to="/contact" className={styles.detailsLink}>
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.discoverMore}>
            <Link
              to="/destinations"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Discover More Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className={styles.aboutUsSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutImageColumn}>
            <div className={styles.imageContent}>
              <FaGlobe />
              <p>15+ Years of Excellence</p>
            </div>
          </div>
          <div className={styles.aboutTextColumn}>
            <p className={styles.aboutSubtitle}>ABOUT WANDERLUST TRAVELS</p>
            <h2>Your Journey Begins With Us</h2>
            <p className={styles.aboutParagraph}>
              Since 2010, we've been crafting extraordinary travel experiences
              that transform ordinary vacations into unforgettable journeys. Our
              team of travel experts brings decades of combined experience to
              help you discover the world's most captivating destinations.
            </p>
            <div className={styles.statsGroup}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>15,000+</span>
                <span className={styles.statLabel}>Happy Travelers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>120+</span>
                <span className={styles.statLabel}>Destinations Worldwide</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>Customer Satisfaction</span>
              </div>
            </div>
            <Link
              to="/about"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.meetTeamBtn}`}
            >
              Meet Our Team →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.quoteIcon}>"</span>
              What Our Travelers Say
              <span className={`${styles.quoteIcon} ${styles.right}`}>"</span>
            </h2>
          </div>
          <div className={styles.testimonialSliderWrapper}>
            <div
              className={styles.testimonialTracks}
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                display: "flex",
                transition: "transform 0.5s ease-in-out",
              }}
            >
              {testimonials.map((t) => (
                <div
                  className={styles.testimonialCard}
                  key={t.id}
                  style={{ minWidth: "100%" }}
                >
                  <div className={styles.ratingBox}>
                    <div className={styles.stars}>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className={styles.ratingNumber}>{t.rating}</span>
                  </div>
                  <p className={styles.reviewText}>{t.text}</p>
                  <div className={styles.authorInfo}>
                    <img
                      src={t.photo}
                      alt={t.name}
                      className={styles.authorPhoto}
                      width="60"
                      height="60"
                      loading="lazy"
                    />
                    <div className={styles.authorDetails}>
                      <p className={styles.authorName}>{t.name}</p>
                      <p className={styles.authorLocation}>{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.sliderControls}>
              <button
                className={`${styles.arrowBtn} ${styles.prevBtn}`}
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <FaArrowLeft />
              </button>
              <button
                className={`${styles.arrowBtn} ${styles.nextBtn}`}
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.ctaBanner}>
        <FaPlane className={styles.planeIcon} />
        <FaShip className={styles.shipIcon} />
        <div className={styles.ctaContainer}>
          <h2>Ready for Your Next Great Adventure?</h2>
          <p>
            Contact our travel experts today to customize your perfect
            itinerary.
          </p>
          <Link
            to="/contact"
            className={`${styles.btn} ${styles.btnSecondary} ${styles.ctaBtn}`}
          >
            Start Planning Now →
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
