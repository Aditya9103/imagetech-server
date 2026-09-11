const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getSubmissions,
  getStats,
  toggleReadStatus,
  deleteSubmission,
  bulkDeleteSubmissions,
} = require('../controllers/adminController');

// Protect all admin routes
router.use(authenticateToken);

// Admin dashboard & submissions
router.get('/submissions', getSubmissions);
router.get('/stats', getStats);
router.patch('/submissions/:id/read', toggleReadStatus);
router.delete('/submissions/:id', deleteSubmission);
router.delete('/submissions', bulkDeleteSubmissions);

module.exports = router;
