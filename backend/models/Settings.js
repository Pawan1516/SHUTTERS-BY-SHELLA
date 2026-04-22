const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  studioName: { type: String, default: 'Shutters By Shella' },
  studioLogo: { type: String, default: '' },
  aboutText: { type: String, default: '' },
  phoneNumber: { type: String, default: '9000092018' },
  whatsappNumber: { type: String, default: '9000092018' },
  whatsappMessage: { type: String, default: 'Hi Shutters By Shella, I want to book a shoot.' },
  emailAddress: { type: String, default: '' },
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  // Feature Toggles
  enableCallButton: { type: Boolean, default: true },
  enableWhatsappButton: { type: Boolean, default: true },
  enableReviews: { type: Boolean, default: true },
  enableInstagramSection: { type: Boolean, default: true },
  enableDownloads: { type: Boolean, default: false },
  enablePrivateGallery: { type: Boolean, default: true },
  
  // Instagram Specific
  instagramPostCount: { type: Number, default: 6 },
  instagramAccessToken: { type: String, default: '' },
  
  urgencyText: { type: String, default: '' }
}, { timestamps: true });


module.exports = mongoose.model('Settings', settingsSchema);
