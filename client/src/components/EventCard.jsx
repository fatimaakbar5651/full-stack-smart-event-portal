import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <div className="event-card">

      {event.banner && (
        <img
          src={event.banner}
          alt={event.title}
          className="event-banner"
        />
      )}

      <div className="event-card-content">

        <span className="event-category">
          {event.category}
        </span>

        <h3>{event.title}</h3>

        <p>
          {event.description
            ? event.description.length > 120
              ? event.description.slice(0, 120) + "..."
              : event.description
            : "No description available."}
        </p>

        <div className="event-info">

          <p>
            📅{" "}
            {event.date
              ? new Date(event.date).toLocaleDateString()
              : "Date TBA"}
          </p>

          <p>
            📍 {event.venue}, {event.city}
          </p>

          <p>
            🎟️ Ticket:{" "}
            {event.ticketPrice === 0
              ? "Free"
              : `Rs. ${event.ticketPrice}`}
          </p>

          <p>
            👥 Capacity: {event.capacity}
          </p>

        </div>

        <Link
          to={`/events/${event._id}`}
          className="btn"
        >
          View Event
        </Link>

      </div>

    </div>
  );
}

export default EventCard;