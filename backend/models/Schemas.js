const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
  thumbnail: String,
  size: Number,
  category: { type: String, default: 'Wedding' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  coverImage: String,
  isPrivate: { type: Boolean, default: false },
  password: { type: String }, // Plain text for simplicity as per requirement or hashed? Let's use plain for gallery access
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  message: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  studioName: { type: String, default: 'Seenu Shella' },
  phoneNumber: { type: String, default: '9000092018' },
  whatsappNumber: { type: String, default: '9000092018' },
  whatsappMessage: { type: String, default: 'Hi Seenu Shella, I want to book a shoot.' },
  emailAddress: { type: String, default: 'contact@seenushella.com' },
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  enableReviews: { type: Boolean, default: true },
  enableInstagramSection: { type: Boolean, default: true },
  enableDownloads: { type: Boolean, default: false },
  enablePrivateGallery: { type: Boolean, default: true },
  enableWhatsappButton: { type: Boolean, default: true }
});

const visitorSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  whatsappClicks: { type: Number, default: 0 },
  callClicks: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = {
  Media: mongoose.model('Media', mediaSchema),
  Event: mongoose.model('Event', eventSchema),
  Review: mongoose.model('Review', reviewSchema),
  Settings: mongoose.model('Settings', settingsSchema),
  Visitor: mongoose.model('Visitor', visitorSchema),
  Admin: mongoose.model('Admin', adminSchema)
};
