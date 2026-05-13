import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Register = lazy(() => import("./components/Register/Register.jsx"));
const Login = lazy(() => import("./components/Login/Login.jsx"));
const AdminPanel = lazy(() => import("./components/AdminPanel/AdminPanel.jsx"));
const Destinations = lazy(() =>
  import("./components/Destinations/Destinations.jsx")
);
const Profile = lazy(() => import("./components/Profile/Profile.jsx"));
const Home = lazy(() => import("./components/Home/Home.jsx"));
const About = lazy(() => import("./components/About/About.jsx"));
const Contact = lazy(() => import("./components/Contact/Contact.jsx"));
const Booking = lazy(() => import("./pages/Booking.jsx"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess.jsx"));

function AppContent() {
  const location = useLocation();
  const hideNavAndFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin";

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </Suspense>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
