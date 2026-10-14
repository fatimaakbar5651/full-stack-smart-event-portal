import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AddSession() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "",
    track: "",
    room: "",
    date: ""
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
      await api.post(`/events/${eventId}/sessions`, {
        title: formData.title,
        description: formData.description,
        speaker: formData.speaker,
        track: formData.track,
        room: formData.room,
        date: formData.date
      });

      setSuccess("Session created successfully!");

      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to create session."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">

        <h1>Add Conference Session</h1>

        <p className="page-description">
          Add a session to your event.
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

          <label>Session Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Introduction to Artificial Intelligence"
            required
          />

          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the session"
            rows="5"
            required
          />

          <label>Speaker</label>

          <input
            type="text"
            name="speaker"
            value={formData.speaker}
            onChange={handleChange}
            placeholder="Speaker name"
            required
          />

          <label>Track</label>

          <input
            type="text"
            name="track"
            value={formData.track}
            onChange={handleChange}
            placeholder="e.g. Technology"
          />

          <label>Room</label>

          <input
            type="text"
            name="room"
            value={formData.room}
            onChange={handleChange}
            placeholder="e.g. Hall A"
          />

          <label>Session Date & Time</label>

          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Session"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddSession;