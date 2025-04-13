const Visit = require('../models/Visit');
const cache = require('../utils/cache');
const cloudinary = require('../utils/cloudinary');

// Verify visit by QR
exports.verifyVisit = async (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData) return res.status(400).json({ message: 'QR data is required' });

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch {
      return res.status(400).json({ message: 'Invalid QR data format' });
    }

    const visitorId = parsedData.visitorId;
    if (!visitorId) return res.status(400).json({ message: 'visitorId not found in QR data' });

    const cacheKey = `visitVerification:${visitorId}`;
    const cachedVisit = cache.get(cacheKey);
    if (cachedVisit) return res.status(200).json({ message: 'Visit verified successfully', visit: cachedVisit });

    const visit = await Visit.findOne({ visitorId });
    if (!visit) return res.status(404).json({ message: 'Visit not found' });

    const nowUTC = new Date();
    const visitStartUTC = visit.visitTime;
    const visitEndUTC = new Date(visitStartUTC.getTime() + visit.duration * 60000);

    const graceBefore = 5 * 60 * 1000;
    const graceAfter = 10 * 60 * 1000;

    const isValidTime =
      nowUTC.getTime() >= visitStartUTC.getTime() - graceBefore &&
      nowUTC.getTime() <= visitEndUTC.getTime() + graceAfter;

    const isApproved = visit.status === 'Approved';

    if (visit.status === 'Expired') {
      return res.status(404).json({ message: 'Visit is already expired', visit });
    }

    if (!isApproved) {
      return res.status(403).json({ message: 'Visit is not approved yet', visit });
    }

    if (!isValidTime || nowUTC > visitEndUTC) {
      visit.status = 'Expired';
      await visit.save();
    }

    cache.set(cacheKey, visit);

    return res.status(200).json({ message: 'Visit verified successfully', visit });
  } catch (err) {
    console.error('Error verifying visit:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mark Entry with Photo
exports.markEntry = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    if (visit.hasEntered) return res.status(400).json({ message: 'Visitor already entered' });

    const { photo } = req.body;
    if (!photo) return res.status(400).json({ message: 'Photo is required for entry' });

    const uploaded = await cloudinary.uploader.upload(photo, { folder: 'VisitEntryPhotos' });

    visit.hasEntered = true;
    visit.entryTime = new Date();
    visit.Image = uploaded.secure_url;

    await visit.save();
    cache.del(`visitVerification:${visit.visitorId}`);

    return res.json({ message: 'Entry marked', visit });
  } catch (err) {
    console.error('Error marking entry:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mark Exit
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
    cache.del(`visitVerification:${visit.visitorId}`);

    return res.json({ message: 'Exit marked', visit });
  } catch (err) {
    console.error('Error marking exit:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
