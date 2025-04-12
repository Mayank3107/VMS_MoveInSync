const Visit = require('../models/Visit');
const Employee = require('../models/Employee');
const sendMail = require('../utils/sendMail');
const Visitor = require('../models/Visitor');
const cache = require('../utils/cache');

// Visitor sends a visit request handling
exports.sendRequest = async (req, res) => {
  const { employeeEmail, visitTime, duration, reason } = req.body;
  console.log('Incoming body:', req.body);

  try {
    const parsedVisitTimeUTC = new Date(visitTime);
    if (isNaN(parsedVisitTimeUTC.getTime())) {
      return res.status(400).json({ message: 'Invalid visit time format' });
    }

    // Convert visit time to IST
    const visitIST = new Date(parsedVisitTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hour = visitIST.getHours();

    if (hour < 10 || hour >= 12) {
      return res.status(400).json({ message: 'Visit time must be between 10 AM and 12 PM IST' });
    }

    const visitor = await Visitor.findById(req.data.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    const employee = await Employee.findOne({ Email: employeeEmail });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Reset daily count if it's a new day (in IST)
    const nowIST = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const currentISTDate = new Date(nowIST).toDateString();

    const lastVisitDate = employee.lastVisitDate
      ? new Date(employee.lastVisitDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      : null;

    if (!lastVisitDate || new Date(lastVisitDate).toDateString() !== currentISTDate) {
      employee.dailyVisitCount = 0;
      employee.lastVisitDate = new Date();
    }

    if (employee.dailyVisitCount >= 5) {
      return res.status(403).json({ message: 'Employee has already 5 visits scheduled today' });
    }

    employee.dailyVisitCount += 1; // ✅ Increment count
    await employee.save(); // ✅ Save to DB

    // Save the visit as pending
    const newVisit = new Visit({
      visitorId: visitor._id,
      visitorName: visitor.Name,
      visitorEmail: visitor.Email,
      visitorPhone: visitor.Number,
      employeeEmail,
      Image: visitor.Image,
      visitTime: parsedVisitTimeUTC,
      duration,
      reason,
      status: 'Pending',
    });

    const savedVisit = await newVisit.save();

    // Invalidate cache for visitor (after new request)
    cache.del(`visitorRequests:${visitor._id}`);

    // Send email notification
    await sendMail(
      employeeEmail,
      'New Visit Request',
      `
        Visitor ${visitor.Name} (Phone: ${visitor.Number}, Email: ${visitor.Email}) has requested a visit.<br>
        Reason: ${reason}<br>
        Scheduled Time: ${visitIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)<br>
        Duration: ${duration} minutes
      `
    );

    res.status(201).json({ message: 'Visit request sent', visit: savedVisit });
  } catch (err) {
    console.error('Error in sendRequest:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Visitor all requests till now
exports.getRequests = async (req, res) => {
  const visitorId = req.data.id;
  console.log(visitorId, '*');

  try {
    // Cache handling with response
    const cachedData = cache.get(`visitorRequests:${visitorId}`);
    if (cachedData) {
      console.log('Serving from cache');
      return res.status(200).json({ visits: cachedData });
    }

    // Fetch all valid visits for visitor
    const visits = await Visit.find({ visitorId }).sort({ createdAt: -1 });

    // Cache for 60 seconds (or any desired TTL)
    cache.set(`visitorRequests:${visitorId}`, visits, 6);

    // Return response
    res.status(200).json({ visits });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch visits', error: err });
  }
};
