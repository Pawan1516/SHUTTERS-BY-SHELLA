require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Media, Event, Review, Settings, Visitor, Admin } = require('./models/Schemas');
const upload = require('./middleware/upload');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shuttersbyshella')
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    // Seed initial admin if none exists
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await new Admin({ email: 'admin@seenushella.com', password: hashedPassword }).save();
        console.log('✅ Default admin created: admin@seenushella.com / admin123');
      }
    } catch (err) {
      console.error('⚠️ Admin seeding failed:', err.message);
    }
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 TIP: Make sure your IP is whitelisted in MongoDB Atlas Network Access.');
  });

// 🛡️ Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// 🔐 AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`🔐 Login Attempt: ${email}`);
  
  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('❌ Login Failed: Admin not found');
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('❌ Login Failed: Incorrect password');
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    console.log('✅ Login Successful!');
    res.json({ token, email: admin.email });
  } catch (err) { 
    console.error('🔥 Login Error:', err.message);
    res.status(500).json({ error: err.message }); 
  }
});

// 🖼️ MEDIA ROUTES
app.get('/api/media', async (req, res) => {
  try {
    const { category, eventId, limit, type } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (eventId) query.eventId = eventId;
    if (type) query.type = type; // ← supports ?type=image or ?type=video
    const media = await Media.find(query).sort({ createdAt: -1 }).limit(parseInt(limit) || 50);
    res.json(media);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/media', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('📤 Uploading to Cloudinary...');
    if (!req.file) {
      console.log('❌ Upload Failed: No file provided');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { category, eventId, tags } = req.body;
    const isVideo = req.file.mimetype.startsWith('video');
    
    const media = new Media({
      type: isVideo ? 'video' : 'image',
      url: req.file.path,
      size: req.file.size,
      category: category || 'Wedding',
      eventId: eventId || null,
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });
    
    await media.save();
    console.log(`✅ Upload Successful: ${media.url}`);
    res.status(201).json(media);
  } catch (err) { 
    console.error('🔥 Cloudinary/Upload Error:', err.message);
    res.status(500).json({ error: 'Cloudinary upload failed. Check your API keys and internet connection.', details: err.message }); 
  }
});

app.delete('/api/media/:id', auth, async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 🎉 EVENT ROUTES
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/events', auth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/events/:id', auth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ⭐ REVIEW ROUTES
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/reviews/all', auth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    const review = new Review({ name, email, rating, message, status: 'pending' });
    await review.save();
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/reviews/:id/status', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(review);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/reviews/:id', auth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 👁️ VISITOR ROUTES
app.get('/api/visitors', async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor();
      await visitor.save();
    }
    res.json(visitor);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/visitors/track', async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) visitor = new Visitor();
    visitor.count += 1;
    visitor.lastUpdated = Date.now();
    await visitor.save();
    res.json(visitor);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/visitors/click', async (req, res) => {
  try {
    const { type } = req.body;
    let visitor = await Visitor.findOne();
    if (!visitor) visitor = new Visitor();
    if (type === 'whatsapp') visitor.whatsappClicks += 1;
    if (type === 'call') visitor.callClicks += 1;
    await visitor.save();
    res.json(visitor);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ⚙️ SETTINGS ROUTES
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 🚨 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('💣 Global Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

// 🚀 SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
