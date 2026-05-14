import { FaArrowDown } from "react-icons/fa";
import styles from "./Hero.module.css";

function Hero() {
  const heroImageUrl = "/images/hero.webp";

  return (
    <>
      <link rel="preload" as="image" href={heroImageUrl} fetchPriority="high" />

      <section
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImageUrl})`,
        }}
      >
        <div className={styles.heroContent}>
          <p className={styles.topText}>DISCOVER THE WORLD</p>
          <h1 className={styles.heroTitle}>
            Explore the Beautiful Places with Us
          </h1>
          <p className={styles.subText}>
            Find your next adventure and create memories that last forever.
          </p>

          <div className={styles.heroActions}>
            <a href="#destinations" className={`${styles.btn} ${styles.btnPrimary}`}>
              Explore Destinations
            </a>
            <a href="/register" className={`${styles.btn} ${styles.btnSecondary}`}>
              Join Now
            </a>
          </div>
        </div>

        <div className={styles.scrollDown}>
          <FaArrowDown />
        </div>
      </section>
    </>
  );
}

export default Hero;