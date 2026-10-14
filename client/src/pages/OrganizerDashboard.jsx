import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events/organization");

      setEvents(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load your events."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalCapacity = events.reduce(
    (total, event) =>
      total + Number(event.capacity || 0),
    0
  );

  const totalTicketValue = events.reduce(
    (total, event) =>
      total + Number(event.ticketPrice || 0),
    0
  );

  return (
    <div className="container">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <h1>Organizer Dashboard</h1>

          <p>
            Manage your conferences and events.
          </p>
        </div>

        <Link
          to="/create-event"
          className="btn"
        >
          + Create Event
        </Link>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* STATISTICS */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <h3>Total Events</h3>
          <strong>
            {events.length}
          </strong>
        </div>

        <div className="stat-card">
          <h3>Total Capacity</h3>
          <strong>
            {totalCapacity}
          </strong>
        </div>

        <div className="stat-card">
          <h3>Events With Tickets</h3>
          <strong>
            {
              events.filter(
                (event) =>
                  Number(event.ticketPrice) > 0
              ).length
            }
          </strong>
        </div>

        <div className="stat-card">
          <h3>Ticket Prices</h3>
          <strong>
            Rs. {totalTicketValue}
          </strong>
        </div>

      </div>

      {/* EVENTS */}

      <h2>My Events</h2>

      {loading ? (
        <div className="loading-page">
          <h2>
            Loading your events...
          </h2>
        </div>
      ) : events.length === 0 ? (

        <div className="empty-state">

          <h3>
            No events yet
          </h3>

          <p>
            You haven't created any events.
          </p>

          <Link
            to="/create-event"
            className="btn"
          >
            Create Your First Event
          </Link>

        </div>

      ) : (

        <div className="event-grid">

          {events.map((event) => (

            <div
              className="event-card"
              key={event._id}
            >

              {/* BANNER */}

              {event.banner && (
                <img
                  src={event.banner}
                  alt={event.title}
                  className="event-banner"
                />
              )}

              <div className="event-card-content">

                {/* CATEGORY */}

                <span className="event-category">
                  {event.category}
                </span>

                {/* TITLE */}

                <h3>
                  {event.title}
                </h3>

                {/* DESCRIPTION */}

                <p>
                  {event.description
                    ? event.description.length > 100
                      ? event.description.slice(0, 100) + "..."
                      : event.description
                    : "No description available."
                  }
                </p>

                {/* EVENT INFORMATION */}

                <div className="event-info">

                  <p>
                    📅{" "}
                    {event.date
                      ? new Date(
                          event.date
                        ).toLocaleDateString()
                      : "Date TBA"}
                  </p>

                  <p>
                    📍 {event.venue}, {event.city}
                  </p>

                  <p>
                    👥 Capacity:{" "}
                    {event.capacity}
                  </p>

                  <p>
                    🎟️{" "}
                    {event.ticketPrice === 0
                      ? "Free Event"
                      : `Rs. ${event.ticketPrice}`}
                  </p>

                </div>

                {/* VIEW EVENT */}

                <div className="event-actions">

  <Link
    to={`/events/${event._id}`}
    className="btn"
  >
    View Event
  </Link>

  <Link
    to={`/events/${event._id}/add-session`}
    className="btn"
  >
    + Add Session
  </Link>

</div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default OrganizerDashboard;