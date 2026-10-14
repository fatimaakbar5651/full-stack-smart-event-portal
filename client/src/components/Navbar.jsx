import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const {
    user,
    logout
  } = useAuth();

  return (
    <nav className="navbar">

      <Link
        to="/"
        className="logo"
      >
        EventHub
      </Link>

      <div className="nav-links">

        <Link to="/">
          Events
        </Link>

        {user && (
          <>
            <Link to="/agenda">
              My Agenda
            </Link>

            <Link to="/bookings">
              My Tickets
            </Link>
          </>
        )}

        {user?.role === "organizer" && (
          <>
            <Link to="/organizer-dashboard">
              Dashboard
            </Link>

            <Link to="/create-event">
              Create Event
            </Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link
              to="/register"
              className="btn"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span>
              Hi, {user.name}
            </span>

            <button
              onClick={logout}
              className="btn"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}