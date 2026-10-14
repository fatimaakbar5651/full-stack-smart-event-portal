import { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";

function Home() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/events");

      setEvents(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase();

    return (
      event.title?.toLowerCase().includes(searchText) ||
      event.description?.toLowerCase().includes(searchText) ||
      event.category?.toLowerCase().includes(searchText) ||
      event.venue?.toLowerCase().includes(searchText) ||
      event.city?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>

      {/* HERO SECTION */}

      <section className="hero">

        <h1>
          Discover Amazing Events
        </h1>

        <p>
          Find conferences, workshops and
          events that match your interests.
        </p>

        <input
          type="text"
          placeholder="Search events by title, city, category..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </section>

      {/* EVENTS */}

      <div className="container">

        <h2>
          {search
            ? "Search Results"
            : "Upcoming Events"}
        </h2>

        {loading ? (

          <div className="loading-page">
            <h2>
              Loading events...
            </h2>
          </div>

        ) : error ? (

          <div>
            <div className="error">
              {error}
            </div>

            <button
              className="btn"
              onClick={fetchEvents}
            >
              Try Again
            </button>
          </div>

        ) : filteredEvents.length === 0 ? (

          <div className="empty-state">

            <h3>
              No events found
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "There are no events available yet."}
            </p>

            {search && (
              <button
                className="btn"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )}

          </div>

        ) : (

          <div className="event-grid">

            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Home;