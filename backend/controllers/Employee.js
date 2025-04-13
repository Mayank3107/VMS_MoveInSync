const QRCode = require('qrcode');
const Visit = require('../models/Visit');
const Visitor = require('../models/Visitor');
const sendMail = require('../utils/sendMail');
const Employee = require('../models/Employee');
const cache = require('../utils/cache');

// Get all the requests for visit for the employee
exports.getVisitRequests = async (req, res) => {
  try {
    // Cache handling
    const key = `visitRequests:${req.user.Email}`;
    const cachedRequests = cache.get(key);

    if (cachedRequests) {
      return res.status(200).json({ requests: cachedRequests, source: 'cache' });
    }

    // Making new response and set cache with 6-second expiration
    const requests = await Visit.find({ employeeEmail: req.user.Email });
    cache.set(key, requests, 6); // Cache for 6 seconds
    res.status(200).json({ requests, source: 'db' });
  } catch (err) {
    // Error handling
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Employee accepts a visit request
exports.acceptRequest = async (req, res) => {
  try {
    // Verify the visit and handle cache
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Visit request not found' });
    
    // Invalidate the cache for the visit request
    cache.del(`visitRequests:${visit.employeeEmail}`);

    // Modify visit status
    visit.status = 'Approved';
    await visit.save();

    // QR code generation
    const qrPayload = {
      visitorId: visit.visitorId,
      visitorName: visit.visitorName,
      employeeEmail: visit.employeeEmail,
      visitTime: visit.visitTime,
      duration: visit.duration,
      status: visit.status
    };

    const qrData = await QRCode.toDataURL(JSON.stringify(qrPayload));

    // Convert visit time to IST for email
    const visitIST = new Date(visit.visitTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Send email to visitor
    await sendMail(
      visit.visitorEmail,
      'Visit Approved',
      `Your visit to ${visit.employeeEmail} has been approved.`,
      `
        <p><strong>Visitor Name:</strong> ${visit.visitorName}</p>
        <p><strong>Employee Email:</strong> ${visit.employeeEmail}</p>
        <p><strong>Visit Time:</strong> ${visitIST} (IST)</p>
        <p><strong>Duration:</strong> ${visit.duration} minutes</p>
        <p><strong>Reason:</strong> ${visit.reason}</p>
        <p><strong>Status:</strong> ${visit.status}</p>
        <p>Scan the QR code below at the gate:</p>
        <img src="${qrData}" alt="QR Code"/>
      `
    );

    // Send email to employee
    await sendMail(
      visit.employeeEmail,
      'Visit Approved',
      `You have approved a visit from ${visit.visitorName} on ${visitIST}.`
    );

    // Final response
    res.status(200).json({ message: 'Visit approved', qrCode: qrData });
  } catch (err) {
    // Error handling
    console.error('Error in acceptRequest:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// User rejects a visit request
exports.rejectRequest = async (req, res) => {
  try {
    // Visit verification and cache handling
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Visit request not found' });

    // Invalidate the cache for the visit request
    cache.del(`visitRequests:${visit.employeeEmail}`);

    // Modify visit status
    visit.status = 'Rejected';
    await visit.save();

    // Send mail to visitor
    await sendMail(
      visit.visitorEmail,
      'Visit Rejected',
      `Your visit request to ${visit.employeeEmail} was rejected.`
    );

    // Send mail to employee
    await sendMail(
      visit.employeeEmail,
      'Visit Rejected',
      `You have rejected the visit request from ${visit.visitorName}.`
    );

    // Final response
    res.status(200).json({ message: 'Visit rejected' });
  } catch (err) {
    // Error handling
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Employee creates a new visit by himself
exports.createVisit = async (req, res) => {
  const { visitorEmail, employeeEmail, visitTime, duration } = req.body;

  try {
    const visitor = await Visitor.findOne({ Email: visitorEmail });
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    const employee = await Employee.findOne({ Email: employeeEmail });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Get current date in IST
    const nowIST = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const currentISTDate = new Date(nowIST).toDateString();

    const lastVisitDate = employee.lastVisitDate
      ? new Date(employee.lastVisitDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      : null;

    // Reset visit count if new day
    if (!lastVisitDate || new Date(lastVisitDate).toDateString() !== currentISTDate) {
      employee.dailyVisitCount = 0;
      employee.lastVisitDate = new Date();
    }

    if (employee.dailyVisitCount >= 5) {
      return res.status(403).json({ message: 'Daily visit limit (5) reached for employee' });
    }

    // Check if visit time is between 10 AM and 12 PM IST
    const visitIST = new Date(new Date(visitTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hour = visitIST.getHours();
    if (hour < 10 || hour >= 12) {
      return res.status(400).json({ message: 'Visit time must be between 10 AM and 12 PM IST' });
    }

    const newVisit = await Visit.create({
      visitorId: visitor._id,
      visitorName: visitor.Name,
      visitorEmail: visitor.Email,
      employeeEmail,
      visitTime: new Date(visitTime),
      duration,
      status: 'Approved',
      Image:visitor.Image
    });

    // Update employee visit count
    employee.dailyVisitCount += 1;
    await employee.save();

    // Send email to visitor
    await sendMail(
      visitorEmail,
      'Visit Approved',
      `Your visit to ${employeeEmail} has been approved.`,
      `
        <p>Your visit has been scheduled.</p>
        <p><strong>Time:</strong> ${visitIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
      `
    );

    // Final response
    res.status(201).json({ message: 'Visit created and approved', visit: newVisit });
  } catch (err) {
    console.error('Error creating visit:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
