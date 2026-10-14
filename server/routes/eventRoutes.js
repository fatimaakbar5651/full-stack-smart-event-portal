import express from "express";

import Event from "../models/Event.js";
import Session from "../models/Session.js";

import {
  protect,
  organizerOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();


// GET ALL EVENTS
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET ORGANIZER EVENTS
router.get(
  "/organization",
  protect,
  organizerOnly,
  async (req, res) => {
    try {

      const events = await Event.find({
        organizer: req.user.id
      })
        .populate(
          "organizer",
          "name email"
        )
        .sort({
          date: 1
        });

      res.json(events);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);
// GET SINGLE EVENT
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const sessions = await Session.find({
      event: event._id
    }).sort({ date: 1 });

    res.json({
      event,
      sessions
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// CREATE EVENT
router.post(
  "/",
  protect,
  organizerOnly,
  async (req, res) => {
    try {
      const event = await Event.create({
        ...req.body,
        organizer: req.user.id
      });

      res.status(201).json(event);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


// CREATE SESSION
router.post(
  "/:eventId/sessions",
  protect,
  organizerOnly,
  async (req, res) => {
    try {
      const session = await Session.create({
        ...req.body,
        event: req.params.eventId
      });

      res.status(201).json(session);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

export default router;