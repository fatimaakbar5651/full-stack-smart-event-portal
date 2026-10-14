import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function Agenda() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my");

      setBookings(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load your agenda."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <h2>Loading your agenda...</h2>
      </div>
    );
  }

  return (
    <div className="container">

      <h1>My Agenda</h1>

      <p className="page-description">
        View your booked events and selected conference sessions.
      </p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (

        <div className="empty-state">

          <h3>Your agenda is empty</h3>

          <p>
            Book an event to start building your agenda.
          </p>

          <Link
            to="/"
            className="btn"
          >
            Explore Events
          </Link>

        </div>

      ) : (

        <div className="agenda-list">

          {bookings.map((booking) => {

            const event = booking.event;

            return (
              <div
                className="agenda-event"
                key={booking._id}
              >

                {/* EVENT INFORMATION */}

                <div className="agenda-event-header">

                  <div>

                    <span className="event-category">
                      {event?.category || "Event"}
                    </span>

                    <h2>
                      {event?.title || "Event"}
                    </h2>

                  </div>

                  {event?._id && (
                    <Link
                      to={`/events/${event._id}`}
                      className="btn"
                    >
                      View Event
                    </Link>
                  )}

                </div>

                <div className="event-info">

                  <p>
                    📅{" "}
                    {event?.date
                      ? new Date(
                          event.date
                        ).toLocaleDateString()
                      : "Date TBA"}
                  </p>

                  <p>
                    📍{" "}
                    {event?.venue || "Venue TBA"},
                    {" "}
                    {event?.city || ""}
                  </p>

                  <p>
                    🎟️ Tickets:{" "}
                    {booking.quantity}
                  </p>

                  <p>
                    Ticket Code:{" "}
                    {booking.ticketCode}
                  </p>

                </div>

                {/* SESSIONS */}

                <div className="agenda-sessions">

                  <h3>
                    My Sessions
                  </h3>

                  {!booking.sessions ||
                  booking.sessions.length === 0 ? (

                    <div className="empty-session">
                      <p>
                        No sessions selected yet.
                      </p>

                      <Link
                        to={`/events/${event?._id}`}
                        className="btn"
                      >
                        View Sessions
                      </Link>
                    </div>

                  ) : (

                    <div className="session-list">

                      {booking.sessions.map(
                        (session) => (

                          <div
                            className="session-card"
                            key={session._id}
                          >

                            <h3>
                              {session.title}
                            </h3>

                            {session.description && (
                              <p>
                                {session.description}
                              </p>
                            )}

                            {session.speaker && (
                              <p>
                                <strong>
                                  Speaker:
                                </strong>{" "}
                                {session.speaker}
                              </p>
                            )}

                            {session.track && (
                              <p>
                                <strong>
                                  Track:
                                </strong>{" "}
                                {session.track}
                              </p>
                            )}

                            {session.room && (
                              <p>
                                <strong>
                                  Room:
                                </strong>{" "}
                                {session.room}
                              </p>
                            )}

                            {session.date && (
                              <p>
                                <strong>
                                  Date:
                                </strong>{" "}
                                {new Date(
                                  session.date
                                ).toLocaleString()}
                              </p>
                            )}

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default Agenda;