const express = require('express');
const { analyzeComplaint } = require('../controllers/ai-Controller');
const { readComplaints, saveComplaint, updateComplaint } = require('../controllers/dbController');

const router = express.Router();

router.post('/otp/send', (req, res) => {
  const { phone } = req.body;
  if (!/^\d{10}$/.test(String(phone || ''))) {
    return res.status(400).json({ message: 'Enter a valid 10-digit mobile number.' });
  }

  res.json({ message: 'Demo OTP sent.', otp: '1234' });
});

router.post('/otp/verify', (req, res) => {
  const { otp } = req.body;
  if (String(otp) !== '1234') {
    return res.status(401).json({ message: 'Invalid OTP.' });
  }

  res.json({ message: 'Login verified.', role: 'MP' });
});

router.get('/complaints', (req, res) => {
  const complaints = readComplaints()
    .sort((a, b) => b.priorityScore - a.priorityScore || new Date(b.createdAt) - new Date(a.createdAt));

  res.json(complaints);
});

router.get('/complaints/:id', (req, res) => {
  const complaint = readComplaints().find(item => item.id === req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
  res.json(complaint);
});

router.post('/complaints', (req, res) => {
  const { description, locationText, coordinates, email, evidenceName, voiceNoteName } = req.body;
  const contactEmail = String(email || '').trim();

  if (!description || description.trim().length < 10) {
    return res.status(400).json({ message: 'Please describe the issue in at least 10 characters.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return res.status(400).json({ message: 'A valid email address is required for follow-up.' });
  }

  const ai = analyzeComplaint({ description, locationText });
  const now = new Date();
  const dateCode = now.toISOString().slice(2, 10).replace(/-/g, '');
  const serial = String(readComplaints().length + 1).padStart(3, '0');

  const complaint = saveComplaint({
    id: `JA-${dateCode}-${serial}`,
    ...ai,
    description: description.trim(),
    locationText: locationText || 'GPS captured location',
    coordinates: coordinates || null,
    status: 'NEW',
    assignedTo: null,
    email: contactEmail,
    evidenceName: evidenceName || '',
    voiceNoteName: voiceNoteName || '',
    beforePhotoName: '',
    afterPhotoName: '',
    budget: '',
    remarks: '',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  res.status(201).json(complaint);
});

router.patch('/complaints/:id/forward', (req, res) => {
  const updated = updateComplaint(req.params.id, () => ({
    status: 'VERIFICATION_PENDING',
    assignedTo: 'JE'
  }));

  if (!updated) return res.status(404).json({ message: 'Complaint not found.' });
  res.json(updated);
});

router.patch('/complaints/:id/verify', (req, res) => {
  const { budget, remarks, beforePhotoName } = req.body;
  const updated = updateComplaint(req.params.id, current => ({
    status: 'VERIFIED',
    assignedTo: current.assignedTo || 'JE',
    budget: budget || current.budget,
    remarks: remarks || current.remarks,
    beforePhotoName: beforePhotoName || current.beforePhotoName
  }));

  if (!updated) return res.status(404).json({ message: 'Complaint not found.' });
  res.json(updated);
});

router.patch('/complaints/:id/progress', (req, res) => {
  const updated = updateComplaint(req.params.id, () => ({ status: 'IN_PROGRESS' }));
  if (!updated) return res.status(404).json({ message: 'Complaint not found.' });
  res.json(updated);
});

router.patch('/complaints/:id/complete', (req, res) => {
  const { remarks, afterPhotoName } = req.body;
  const updated = updateComplaint(req.params.id, current => ({
    status: 'COMPLETED',
    assignedTo: current.assignedTo || 'JE',
    remarks: remarks || current.remarks,
    afterPhotoName: afterPhotoName || current.afterPhotoName || 'after-work-photo.jpg'
  }));

  if (!updated) return res.status(404).json({ message: 'Complaint not found.' });
  res.json(updated);
});

router.get('/works', (req, res) => {
  const works = readComplaints()
    .filter(item => item.status === 'COMPLETED')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  res.json(works);
});

module.exports = router;
