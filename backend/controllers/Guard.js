const Visit = require('../models/Visit');
const cache = require('../utils/cache');

// Guard verify the visit details
exports.verifyVisit = async (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData) {
      return res.status(400).json({ message: 'QR data is required' });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid QR data format' });
    }

    const visitorId = parsedData.visitorId;
    if (!visitorId) {
      return res.status(400).json({ message: 'visitorId not found in QR data' });
    }

    // Check cache first
    const cacheKey = `visitVerification:${visitorId}`;
    const cachedVisit = cache.get(cacheKey);
    if (cachedVisit) {
      return res.status(200).json({ message: 'Visit verified successfully', visit: cachedVisit });
    }

    const visit = await Visit.findOne({ visitorId });
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    // Time handling
    const nowUTC = new Date();
    const visitStartUTC = visit.visitTime;
    const visitEndUTC = new Date(visitStartUTC.getTime() + visit.duration * 60 * 1000);

    const istOffset = 0; // Adjust according to your time zone if needed
    const visitStartIST = new Date(visitStartUTC.getTime() + istOffset);
    const visitEndIST = new Date(visitEndUTC.getTime() + istOffset);

    const graceBefore = 5 * 60 * 1000; // 5 minutes before the visit
    const graceAfter = 10 * 60 * 1000; // 10 minutes after the visit

    const isValidTime =
      nowUTC.getTime() >= visitStartUTC.getTime() - graceBefore &&
      nowUTC.getTime() <= visitEndUTC.getTime() + graceAfter;

    const isApproved = visit.status === 'Approved';

    if (visit.status === 'Expired') {
      return res.status(404).json({
        message: 'Visit is already expired',
        visit: {
          _id: visit._id,
          visitorName: visit.visitorName,
          visitorEmail: visit.visitorEmail,
          employeeEmail: visit.employeeEmail,
          Image: visit.Image,
          status: visit.status,
          visitTime: visitStartIST,
          duration: visit.duration,
          reason: visit.reason,
          hasEntered: visit.hasEntered,
          hasExited: visit.hasExited,
          entryTime: visit.entryTime,
          exitTime: visit.exitTime
        }
      });
    }

    if (!isApproved) {
      return res.status(403).json({
        message: 'Visit is not approved yet',
        visit: {
          _id: visit._id,
          visitorName: visit.visitorName,
          visitorEmail: visit.visitorEmail,
          employeeEmail: visit.employeeEmail,
          Image: visit.Image,
          status: visit.status,
          visitTime: visitStartIST,
          duration: visit.duration,
          reason: visit.reason,
        }
      });
    }

    // If the visit time has passed and it's expired, change status to Expired
    if (!isValidTime || nowUTC.getTime() > visitEndUTC.getTime()) {
      visit.status = 'Expired';
      await visit.save();
    }

    // Cache the visit verification response
    cache.set(cacheKey, {
      _id: visit._id,
      visitorName: visit.visitorName,
      visitorEmail: visit.visitorEmail,
      employeeEmail: visit.employeeEmail,
      Image: visit.Image,
      status: visit.status,
      visitTime: visitStartIST,
      duration: visit.duration,
      reason: visit.reason,
      hasEntered: visit.hasEntered,
      hasExited: visit.hasExited,
      entryTime: visit.entryTime,
      exitTime: visit.exitTime
    });

    // Valid Visit
    return res.status(200).json({
      message: 'Visit verified successfully',
      visit: {
        _id: visit._id,
        visitorName: visit.visitorName,
        visitorEmail: visit.visitorEmail,
        employeeEmail: visit.employeeEmail,
        Image: visit.Image,
        status: visit.status,
        visitTime: visitStartIST,
        duration: visit.duration,
        reason: visit.reason,
        hasEntered: visit.hasEntered,
        hasExited: visit.hasExited,
        entryTime: visit.entryTime,
        exitTime: visit.exitTime
      },
    });
  } catch (err) {
    console.error('Error verifying visit:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Handling visitor entry
exports.markEntry = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Visit not found' });

    if (visit.hasEntered) return res.status(400).json({ message: 'Visitor already entered' });

    visit.hasEntered = true;
    visit.entryTime = new Date();
    await visit.save();

    // Clear cache since visit status has changed
    cache.del(`visitVerification:${visit.visitorId}`);

    res.json({ message: 'Entry marked', visit });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Handling visitor outing
exports.markExit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Visit not found' });

    if (!visit.hasEntered) return res.status(400).json({ message: 'Visitor has not entered yet' });
    if (visit.hasExited) return res.status(400).json({ message: 'Visitor already exited' });

    visit.hasExited = true;
    visit.exitTime = new Date();
    visit.status = 'Expired';
    await visit.save();

    // Clear cache since visit status has changed
    cache.del(`visitVerification:${visit.visitorId}`);

    res.json({ message: 'Exit marked', visit });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
