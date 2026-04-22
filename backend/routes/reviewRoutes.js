const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/authMiddleware');

// Add a review (User)
router.post('/', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all approved reviews (Public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).populate('eventId', 'title').sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all reviews
router.get('/all', protect, admin, async (req, res) => {
  try {
    const reviews = await Review.find().populate('eventId', 'title').sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update Status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.status = req.body.status || review.status;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
