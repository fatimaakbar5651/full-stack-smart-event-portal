import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // AI states
  const [interest, setInterest] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/events/${id}`);

      setEvent(response.data.event);
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load event."
      );
    } finally {
      setLoading(false);
    }
  };

  // SELECT / UNSELECT SESSION
  const toggleSession = (sessionId) => {
    setSelectedSessions((previous) => {
      if (previous.includes(sessionId)) {
        return previous.filter(
          (id) => id !== sessionId
        );
      }

      return [...previous, sessionId];
    });
  };

  // AI RECOMMENDATIONS
  const getRecommendations = async () => {
    if (!interest.trim()) {
      setAiError(
        "Please enter your interests first."
      );
      return;
    }

    if (sessions.length === 0) {
      setAiError(
        "There are no sessions available for AI recommendations."
      );
      return;
    }

    try {
      setAiLoading(true);
      setAiError("");
      setRecommendations([]);

      const response = await api.post(
        "/ai/recommend",
        {
          interest: interest.trim(),
          sessions: sessions
        }
      );

      setRecommendations(
        response.data.recommendations || []
      );
    } catch (error) {
      console.error(error);

      setAiError(
        error.response?.data?.message ||
          "Unable to get AI recommendations."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // BOOKING
  const handleBooking = async () => {
    if (!user) {
      setError(
        "Please login before booking a ticket."
      );
      return;
    }

    if (quantity < 1) {
      setError(
        "Please select at least one ticket."
      );
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/bookings",
        {
          eventId: event._id,
          quantity: Number(quantity),
          sessions: selectedSessions
        }
      );

      setSuccess(
        `Booking successful! Your ticket code is ${response.data.ticketCode}`
      );

      setQuantity(1);
      setSelectedSessions([]);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to book ticket."
      );
    } finally {
      setBooking(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="loading-page">
        <h2>Loading event...</h2>
      </div>
    );
  }

  // ERROR
  if (error && !event) {
    return (
      <div className="container">
        <div className="error">
          {error}
        </div>

        <Link
          to="/"
          className="btn"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <h2>Event not found.</h2>
      </div>
    );
  }

  const totalPrice =
    Number(quantity) *
    Number(event.ticketPrice || 0);

  return (
    <div className="container">

      {/* EVENT HEADER */}

      <div className="event-details">

        {event.banner && (
          <img
            src={event.banner}
            alt={event.title}
            className="event-details-banner"
          />
        )}

        <span className="event-category">
          {event.category}
        </span>

        <h1>{event.title}</h1>

        <p className="event-description">
          {event.description}
        </p>

        {/* EVENT INFORMATION */}

        <div className="event-details-info">

          <div className="event-detail-item">
            <strong>Date</strong>

            <span>
              {new Date(
                event.date
              ).toLocaleDateString()}
            </span>
          </div>

          <div className="event-detail-item">
            <strong>Venue</strong>
            <span>{event.venue}</span>
          </div>

          <div className="event-detail-item">
            <strong>City</strong>
            <span>{event.city}</span>
          </div>

          <div className="event-detail-item">
            <strong>Capacity</strong>
            <span>{event.capacity}</span>
          </div>

          <div className="event-detail-item">
            <strong>Ticket Price</strong>

            <span>
              {event.ticketPrice === 0
                ? "Free"
                : `Rs. ${event.ticketPrice}`}
            </span>
          </div>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="success">
          {success}
        </div>
      )}

      {/* AI RECOMMENDATIONS */}

      {user && sessions.length > 0 && (
        <section className="event-section ai-section">

          <h2>
            AI Session Recommendations
          </h2>

          <p className="page-description">
            Tell our AI what topics you are
            interested in, and it will recommend
            the most relevant conference sessions.
          </p>

          <textarea
            value={interest}
            onChange={(e) =>
              setInterest(e.target.value)
            }
            placeholder="Example: I am interested in artificial intelligence, cybersecurity and web development."
            rows="4"
          />

          <button
            className="btn"
            onClick={getRecommendations}
            disabled={aiLoading}
          >
            {aiLoading
              ? "Finding Best Sessions..."
              : "Get AI Recommendations"}
          </button>

          {aiError && (
            <div className="error">
              {aiError}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="ai-results">

              <h3>
                Recommended Sessions
              </h3>

              {recommendations.map(
                (recommendation, index) => (
                  <div
                    className="ai-recommendation"
                    key={index}
                  >

                    <h4>
                      {index + 1}.{" "}
                      {recommendation.sessionTitle}
                    </h4>

                    <p>
                      {recommendation.reason}
                    </p>

                  </div>
                )
              )}

            </div>
          )}

        </section>
      )}

      {/* SESSIONS */}

      <section className="event-section">

        <h2>
          Conference Sessions
        </h2>

        {sessions.length === 0 ? (

          <div className="empty-state">

            <h3>
              No sessions available
            </h3>

            <p>
              Sessions for this event have not
              been added yet.
            </p>

          </div>

        ) : (

          <div className="session-list">

            {sessions.map((session) => (

              <div
                className="session-card"
                key={session._id}
              >

                <label className="session-select">

                  <input
                    type="checkbox"
                    checked={selectedSessions.includes(
                      session._id
                    )}
                    onChange={() =>
                      toggleSession(
                        session._id
                      )
                    }
                  />

                  <span>
                    Select this session
                  </span>

                </label>

                <h3>
                  {session.title}
                </h3>

                {session.description && (
                  <p>
                    {session.description}
                  </p>
                )}

                <p>
                  <strong>
                    Speaker:
                  </strong>{" "}
                  {session.speaker}
                </p>

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

            ))}

          </div>

        )}

      </section>

      {/* BOOKING */}

      {user ? (

        <div className="booking-box">

          <h2>
            Book Your Ticket
          </h2>

          <p>
            Select the number of tickets
            you want.
          </p>

          <label>
            Number of Tickets
          </label>

          <input
            type="number"
            min="1"
            max={event.capacity}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(
                  1,
                  Number(e.target.value)
                )
              )
            }
          />

          <p>
            <strong>
              Total:{" "}
              {event.ticketPrice === 0
                ? "Free"
                : `Rs. ${totalPrice}`}
            </strong>
          </p>

          <button
            className="btn"
            onClick={handleBooking}
            disabled={booking}
          >
            {booking
              ? "Booking..."
              : "Book Ticket"}
          </button>

        </div>

      ) : (

        <div className="booking-box">

          <h2>
            Want to book this event?
          </h2>

          <p>
            Please login or create an
            account first.
          </p>

          <Link
            to="/login"
            className="btn"
          >
            Login to Book
          </Link>

        </div>

      )}

    </div>
  );
}

export default EventDetails;