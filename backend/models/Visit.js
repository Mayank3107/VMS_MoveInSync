const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  visitorId: String,
  visitorName: String,
  visitorEmail: String,
  employeeEmail: String,
  visitTime: Date,
  duration: Number,
  Company:String,
  reason: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Expired'],
    default: 'Pending',
  },
  hasEntered: { type: Boolean, default: false },
  hasExited: { type: Boolean, default: false },
  Image: { type: String, required: true },
  entryTime: Date,
  exitTime: Date
}, { timestamps: true });

const Visit = mongoose.models.Visit || mongoose.model('Visit', VisitSchema);
module.exports = Visit;
