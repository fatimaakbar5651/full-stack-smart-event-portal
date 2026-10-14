import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    speaker: {
      type: String,
      required: true
    },

    track: {
      type: String,
      default: ""
    },

    room: {
      type: String,
      default: ""
    },

    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Session", sessionSchema);