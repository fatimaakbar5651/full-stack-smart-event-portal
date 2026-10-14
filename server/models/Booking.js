import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    totalPrice: {
      type: Number,
      required: true
    },

    ticketCode: {
      type: String,
      required: true,
      unique: true
    },

    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Booking", bookingSchema);