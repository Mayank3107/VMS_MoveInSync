const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  PassWord: {
    type: String,
    required: true
  },
  Number: {
    type: String,
    required: true
  },
  Image: {
    type: String,
    required: true
  },
  Company: {
    type: String,
    required: false  // optional; change to `true` if you want it required
  }
});

const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
module.exports = Visitor;
