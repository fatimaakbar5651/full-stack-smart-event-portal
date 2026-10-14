import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    banner: "",
    category: "",
    date: "",
    venue: "",
    city: "",
    capacity: "",
    ticketPrice: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/events", {
        title: formData.title,
        description: formData.description,
        banner: formData.banner,
        category: formData.category,
        date: formData.date,
        venue: formData.venue,
        city: formData.city,
        capacity: Number(formData.capacity),
        ticketPrice: Number(formData.ticketPrice)
      });

      setSuccess("Event created successfully!");

      setTimeout(() => {
        navigate("/organizer-dashboard");
      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to create event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">

      <div className="form-card">

        <h1>Create Event</h1>

        <p>
          Create a new conference or event.
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* EVENT TITLE */}

          <label>
            Event Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />

          {/* DESCRIPTION */}

          <label>
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your event"
            rows="5"
            required
          />

          {/* BANNER */}

          <label>
            Banner Image URL
          </label>

          <input
            type="url"
            name="banner"
            value={formData.banner}
            onChange={handleChange}
            placeholder="https://example.com/banner.jpg"
          />

          {/* CATEGORY */}

          <label>
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Category
            </option>

            <option value="Technology">
              Technology
            </option>

            <option value="Business">
              Business
            </option>

            <option value="Education">
              Education
            </option>

            <option value="Science">
              Science
            </option>

            <option value="Workshop">
              Workshop
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {/* DATE */}

          <label>
            Event Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          {/* VENUE */}

          <label>
            Venue
          </label>

          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Enter venue"
            required
          />

          {/* CITY */}

          <label>
            City
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
          />

          {/* CAPACITY */}

          <label>
            Maximum Capacity
          </label>

          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="100"
            min="1"
            required
          />

          {/* TICKET PRICE */}

          <label>
            Ticket Price
          </label>

          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
          />

          {/* SUBMIT */}

          <button
            type="submit"
            className="btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Event"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateEvent;