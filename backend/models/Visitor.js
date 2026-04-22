const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  totalCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  sessions: [{ type: String }], // Store simple IPs or session hashes to measure unique visits
  whatsappClicks: { type: Number, default: 0 },
  callClicks: { type: Number, default: 0 }
});


module.exports = mongoose.model('Visitor', visitorSchema);
