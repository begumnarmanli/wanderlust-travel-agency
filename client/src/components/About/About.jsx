import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
  return (
    <main>
      <section className={styles["about-hero-section"]}>
        <div className={`${styles.container} ${styles["hero-content"]}`}>
          <h1>About Wanderlust Travels</h1>
          <p>Creating unforgettable journeys since 2010.</p>
        </div>
      </section>

      <section className={`${styles["story-section"]} ${styles.container}`}>
        <div className={styles["story-content"]}>
          <span className={styles["story-subtitle"]}>OUR STORY</span>
          <h2>Turning Dreams Into Reality Since 2010</h2>

          <p>
            Wanderlust Travels was born from a simple belief: travel has the
            power to transform lives. Our founder, Sarah Johnson, started this
            journey after years of exploring the world and witnessing how travel
            creates lasting memories and broadens perspectives.
          </p>
          <p>
            What began as a small boutique agency has grown into a trusted name
            in the travel industry, serving over
            <strong> 15,000 happy travelers.</strong> Our success comes from our
            unwavering commitment to quality, authenticity, and personalized
            service.
          </p>
          <p>
            Every member of our team is a passionate traveler who personally
            visits and vets each destination we offer. We don't just sell
            trips—we craft experiences that resonate with your unique interests
            and aspirations.
          </p>
          <p>
            Today, we're proud to offer curated travel experiences to over
            <strong> 120 destinations worldwide,</strong> each one carefully
            selected to provide authentic cultural immersion, breathtaking
            natural beauty, and unforgettable adventures.
          </p>
        </div>

        <div className={styles["story-image"]}>
          <div className={styles["image-wrapper-about"]}>
            <img
              src="/images/about-story.webp"
              alt="Office Map"
              className={styles["map-image"]}
              width="600"
              height="400"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className={styles["stats-full-width"]}>
        <div className={`${styles.container} ${styles["stats-content"]}`}>
          <div className={styles["stat-item"]}>
            <span className={styles["stat-number"]}>15,000+</span>
            <p className={styles["stat-label"]}>Happy Travelers</p>
          </div>
          <div className={styles["stat-item"]}>
            <span className={styles["stat-number"]}>120+</span>
            <p className={styles["stat-label"]}>Destinations Worldwide</p>
          </div>
          <div className={styles["stat-item"]}>
            <span className={styles["stat-number"]}>98%</span>
            <p className={styles["stat-label"]}>Customer Satisfaction</p>
          </div>
          <div className={styles["stat-item"]}>
            <span className={styles["stat-number"]}>15+</span>
            <p className={styles["stat-label"]}>Years of Excellence</p>
          </div>
        </div>
      </section>

      <section className={styles["core-values-section"]}>
        <div className={styles.container}>
          <span className={styles["section-subtitle-small"]}>OUR VALUES</span>
          <h2>What Drives Us</h2>
          <p className={styles["section-description"]}>
            Our core values guide everything we do, ensuring exceptional
            experiences for every traveler
          </p>

          <div className={styles["values-grid"]}>
            <div className={styles["value-card"]}>
              <div className={styles["value-icon"]}>
                <i className="fas fa-heart"></i>
              </div>
              <h3>Passion for Travel</h3>
              <p>
                We live and breathe travel. Our team personally visits
                destinations to ensure authentic, high-quality experiences for
                our clients.
              </p>
            </div>

            <div className={styles["value-card"]}>
              <div className={styles["value-icon"]}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Trust & Safety</h3>
              <p>
                Your safety is our priority. We partner with trusted providers
                and maintain comprehensive travel insurance for peace of mind.
              </p>
            </div>

            <div className={styles["value-card"]}>
              <div className={styles["value-icon"]}>
                <i className="fas fa-headset"></i>
              </div>
              <h3>7/24 Support</h3>
              <p>
                Our dedicated support team is available around the clock to
                assist you before, during, and after your journey.
              </p>
            </div>

            <div className={styles["value-card"]}>
              <div className={styles["value-icon"]}>
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Sustainable Tourism</h3>
              <p>
                We’re committed to responsible travel practices that protect the
                environment and support local communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles["team-section"]} id="team">
        <div className={styles.container}>
          <span
            className={`${styles["section-subtitle-small"]} ${styles["team-subtitle"]}`}
          >
            OUR TEAM
          </span>
          <h2 className={styles["team-section-title"]}>Meet the Experts</h2>
          <p
            className={`${styles["section-description"]} ${styles["team-description"]}`}
          >
            Passionate travel professionals dedicated to making your journey
            extraordinary
          </p>

          <div className={styles["team-grid"]}>
            <div className={styles["team-member-card"]}>
              <div className={styles["member-image-wrapper"]}>
                <img
                  src="/images/sarah.webp"
                  alt="Sarah Johnson, Founder & CEO"
                  className={styles["member-photo"]}
                  width="300"
                  height="350"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles["member-info"]}>
                <h3>Sarah Johnson</h3>
                <span className={styles["member-title"]}>Founder & CEO</span>
                <p className={styles["member-bio"]}>
                  With 20 years in the travel industry, Sarah founded Wanderlust
                  Travels to share her passion for exploration.
                </p>
              </div>
            </div>

            <div className={styles["team-member-card"]}>
              <div className={styles["member-image-wrapper"]}>
                <img
                  src="/images/Michael-Chen.webp"
                  alt="Michael Chen, Head of Operations"
                  className={styles["member-photo"]}
                  width="300"
                  height="350"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles["member-info"]}>
                <h3>Michael Chen</h3>
                <span className={styles["member-title"]}>
                  Head of Operations
                </span>
                <p className={styles["member-bio"]}>
                  Michael ensures every trip runs smoothly, coordinating with
                  partners worldwide to deliver exceptional experiences.
                </p>
              </div>
            </div>

            <div className={styles["team-member-card"]}>
              <div className={styles["member-image-wrapper"]}>
                <img
                  src="/images/Emma-Rodriguez.webp"
                  alt="Emma Rodriguez, Travel Consultant"
                  className={styles["member-photo"]}
                  width="300"
                  height="350"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles["member-info"]}>
                <h3>Emma Rodriguez</h3>
                <span className={styles["member-title"]}>
                  Travel Consultant
                </span>
                <p className={styles["member-bio"]}>
                  Emma specializes in creating personalized itineraries that
                  match each traveler's unique preferences and dreams.
                </p>
              </div>
            </div>

            <div className={styles["team-member-card"]}>
              <div className={styles["member-image-wrapper"]}>
                <img
                  src="/images/david.webp"
                  alt="David Thompson, Adventure Specialist"
                  className={styles["member-photo"]}
                  width="300"
                  height="350"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles["member-info"]}>
                <h3>David Thompson</h3>
                <span className={styles["member-title"]}>
                  Adventure Specialist
                </span>
                <p className={styles["member-bio"]}>
                  David curates thrilling adventure packages for those seeking
                  adrenaline-pumping experiences around the globe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles["cta-adventure-full"]}>
        <div
          className={`${styles.container} ${styles["cta-adventure-wrapper"]}`}
        >
          <h2>Ready to Start Your Adventure?</h2>
          <p>Let our experienced team help you plan the perfect journey</p>
          <Link to="/contact" className={styles["cta-adventure-btn"]}>
            {" "}
            Get in Touch{" "}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
