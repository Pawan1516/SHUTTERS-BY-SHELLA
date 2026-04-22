const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { protect, admin } = require('../middleware/authMiddleware');

// Increment Visitor Count
router.post('/track', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    let visitorData = await Visitor.findOne();
    if (!visitorData) {
      visitorData = await Visitor.create({ totalCount: 1, sessions: [ip] });
      return res.json({ count: visitorData.totalCount });
    }

    if (!visitorData.sessions.includes(ip)) {
      visitorData.sessions.push(ip);
      visitorData.totalCount += 1;
      visitorData.lastUpdated = Date.now();
      await visitorData.save();
    }
    
    res.json({ count: visitorData.totalCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Track Clicks (WhatsApp/Call)
router.post('/click', async (req, res) => {
  try {
    const { type } = req.body; // 'whatsapp' or 'call'
    let visitorData = await Visitor.findOne();
    if (!visitorData) visitorData = await Visitor.create({});
    
    if (type === 'whatsapp') visitorData.whatsappClicks += 1;
    if (type === 'call') visitorData.callClicks += 1;
    
    await visitorData.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Visitor Count and Clicks
router.get('/', async (req, res) => {
  try {
    const visitorData = await Visitor.findOne();
    res.json({ 
        count: visitorData ? visitorData.totalCount : 0,
        whatsappClicks: visitorData ? visitorData.whatsappClicks : 0,
        callClicks: visitorData ? visitorData.callClicks : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

