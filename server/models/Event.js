import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    banner: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    venue: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    capacity: {
      type: Number,
      required: true
    },

    ticketPrice: {
      type: Number,
      default: 0
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Event", eventSchema);