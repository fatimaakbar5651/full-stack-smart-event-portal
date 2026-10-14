import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my");

      setBookings(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <h2>Loading your tickets...</h2>
      </div>
    );
  }

  return (
    <div className="container">

      <h1>My Tickets</h1>

      <p className="page-description">
        View all the events you have booked.
      </p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (

        <div className="empty-state">

          <h3>No tickets yet</h3>

          <p>
            You haven't booked any events yet.
          </p>

          <Link
            to="/"
            className="btn"
          >
            Explore Events
          </Link>

        </div>

      ) : (

        <div>

          {bookings.map((booking) => {

            const event = booking.event;

            return (
              <div
                className="ticket-card"
                key={booking._id}
              >

                {/* EVENT BANNER */}

                {event?.banner && (
                  <img
                    src={event.banner}
                    alt={event.title}
                    className="ticket-banner"
                  />
                )}

                {/* EVENT CATEGORY */}

                {event?.category && (
                  <span className="event-category">
                    {event.category}
                  </span>
                )}

                {/* EVENT TITLE */}

                <h2>
                  {event?.title || "Event"}
                </h2>

                {/* EVENT DETAILS */}

                <p>
                  <strong>Date:</strong>{" "}
                  {event?.date
                    ? new Date(
                        event.date
                      ).toLocaleDateString()
                    : "Not available"}
                </p>

                <p>
                  <strong>Venue:</strong>{" "}
                  {event?.venue || "Not available"}
                </p>

                <p>
                  <strong>City:</strong>{" "}
                  {event?.city || "Not available"}
                </p>

                {/* BOOKING DETAILS */}

                <p>
                  <strong>Tickets:</strong>{" "}
                  {booking.quantity}
                </p>

                <p>
                  <strong>Total Price:</strong>{" "}
                  {booking.totalPrice === 0
                    ? "Free"
                    : `Rs. ${booking.totalPrice}`}
                </p>

                <p>
                  <strong>Ticket Code:</strong>
                </p>

                <div className="ticket-code">
                  {booking.ticketCode}
                </div>

                {/* BOOKING DATE */}

                {booking.createdAt && (
                  <p>
                    <strong>Booked On:</strong>{" "}
                    {new Date(
                      booking.createdAt
                    ).toLocaleDateString()}
                  </p>
                )}

                {/* VIEW EVENT */}

                {event?._id && (
                  <Link
                    to={`/events/${event._id}`}
                    className="btn"
                  >
                    View Event
                  </Link>
                )}

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default MyBookings;