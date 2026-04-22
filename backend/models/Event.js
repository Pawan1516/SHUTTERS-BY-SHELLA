const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  isPrivate: { type: Boolean, default: false },
  password: { type: String },
  coverMedia: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
