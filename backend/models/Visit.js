const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  visitorId: String,
  visitorName: String,
  visitorEmail: String,
  employeeEmail: String,
  visitTime: Date,
  duration: Number,
  reason: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected','Expired'],
    default: 'Pending',
  },

  // ✅ New Fields for Guard Entry/Exit Management:
  hasEntered: {
    type: Boolean,
    default: false,
  },
  Image:{
    type:String,
    require:true
  },
  hasExited: {
    type: Boolean,
    default: false,
  },
  entryTime: Date,
  exitTime: Date,

}, { timestamps: true });

const Visit = mongoose.models.Visit || mongoose.model('Visit', VisitSchema);
module.exports = Visit;
