import express from "express";
import crypto from "crypto";

import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import Session from "../models/Session.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// BOOK TICKET
router.post("/", protect, async (req, res) => {
  try {
    const {
      eventId,
      quantity,
      sessions = []
    } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Invalid quantity"
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Check selected sessions
    if (!Array.isArray(sessions)) {
      return res.status(400).json({
        message: "Invalid sessions"
      });
    }

    if (sessions.length > 0) {
      const validSessions = await Session.find({
        _id: { $in: sessions },
        event: event._id
      });

      if (validSessions.length !== sessions.length) {
        return res.status(400).json({
          message: "One or more selected sessions are invalid"
        });
      }
    }

    // Check available tickets
    const existingBookings = await Booking.aggregate([
      {
        $match: {
          event: event._id
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$quantity"
          }
        }
      }
    ]);

    const booked =
      existingBookings.length > 0
        ? existingBookings[0].total
        : 0;

    const remaining =
      event.capacity - booked;

    if (quantity > remaining) {
      return res.status(400).json({
        message: `Only ${remaining} tickets are available`
      });
    }

    // Generate ticket code
    const ticketCode =
      "EVT-" +
      crypto
        .randomBytes(6)
        .toString("hex")
        .toUpperCase();

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: event._id,
      quantity,
      totalPrice:
        quantity * event.ticketPrice,
      ticketCode,
      sessions
    });

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate("event")
        .populate("sessions");

    res.status(201).json(
      populatedBooking
    );

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
});

// MY BOOKINGS
router.get("/my", protect, async (req, res) => {
  try {
    const bookings =
      await Booking.find({
        user: req.user.id
      })
        .populate("event")
        .populate("sessions")
        .sort({
          createdAt: -1
        });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;