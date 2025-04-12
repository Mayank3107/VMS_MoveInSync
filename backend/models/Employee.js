const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  PassWord: { type: String, required: true },
  Number: { type: String, required: true },
  Department: { type: String, required: true },
  Image: { type: String, required: true },
  dailyVisitCount: { type: Number, default: 0 },
  lastVisitDate: { type: Date }
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
