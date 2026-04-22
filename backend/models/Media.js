const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
  contentType: { type: String },
  thumbnail: { type: String },
  size: { type: Number }, // in bytes
  category: { type: String, enum: ['Wedding', 'Pre-wedding', 'Events', 'Portraits', 'Other'], default: 'Other' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
