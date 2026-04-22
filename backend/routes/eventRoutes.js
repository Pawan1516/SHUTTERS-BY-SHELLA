const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Media = require('../models/Media');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all public events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isPrivate: false }).sort('-date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get event by id (with password check if private)
router.post('/:id/access', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.isPrivate) {
      if (req.body.password !== event.password) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
    }
    
    const media = await Media.find({ eventId: event._id });
    res.json({ event, media });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create Event
router.post('/', protect, admin, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete Event
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
