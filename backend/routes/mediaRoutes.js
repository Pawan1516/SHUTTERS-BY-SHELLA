const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// Get all media with filtering
router.get('/', async (req, res) => {
  try {
    const { category, type } = req.query;
    let query = {};
    if (category) query.category = category;
    if (type) query.type = type;
    const media = await Media.find(query).sort('-createdAt').populate('eventId', 'title');
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload media
router.post('/', protect, admin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const isVideo = req.file.mimetype.includes('video');
    const fileSizeMB = req.file.size / (1024 * 1024);

    // Enforce limits from prompt
    if (!isVideo && fileSizeMB > 5) {
       return res.status(400).json({ message: 'Image too large. Maximum size is 5MB.' });
    }
    if (isVideo && fileSizeMB > 50) {
       return res.status(400).json({ message: 'Video too large. Maximum size is 50MB.' });
    }

    const newMedia = new Media({
      type: isVideo ? 'video' : 'image',
      url: req.file.path || req.file.secure_url, // Cloudinary provides the URL in path or secure_url
      thumbnail: isVideo ? req.file.path?.replace(/\.[^/.]+$/, ".jpg") : req.file.path, // Cloudinary auto-gen thumbnail for video if format changed
      contentType: req.file.mimetype,
      size: req.file.size,
      category: req.body.category || 'Other',
      tags: req.body.tags ? req.body.tags.split(',') : [],
      eventId: req.body.eventId || null
    });

    await newMedia.save();
    res.status(201).json(newMedia);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete media
router.delete('/:id', protect, admin, async (req, res) => {

  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    await media.deleteOne();
    res.json({ message: 'Media removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
