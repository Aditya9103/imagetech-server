const Submission = require('../models/Submission');

/**
 * @desc    Get all submissions with optional filter and pagination
 * @route   GET /api/admin/submissions
 * @access  Private (Admin)
 */
const getSubmissions = async (req, res) => {
  try {
    const { type, isRead, sourceWebsite, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (type && ['quote', 'contact'].includes(type)) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (sourceWebsite && sourceWebsite !== 'all') filter.sourceWebsite = sourceWebsite;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [submissions, total, websites] = await Promise.all([
      Submission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Submission.countDocuments(filter),
      Submission.distinct('sourceWebsite'),
    ]);

    res.json({
      submissions,
      total,
      websites: websites.filter(Boolean),
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc    Get dashboard metrics & stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalQuotes, totalContacts, unreadQuotes, unreadContacts, todaySubmissions, websites] = await Promise.all([
      Submission.countDocuments({ type: 'quote' }),
      Submission.countDocuments({ type: 'contact' }),
      Submission.countDocuments({ type: 'quote', isRead: false }),
      Submission.countDocuments({ type: 'contact', isRead: false }),
      Submission.countDocuments({ createdAt: { $gte: today } }),
      Submission.distinct('sourceWebsite'),
    ]);

    res.json({
      totalQuotes,
      totalContacts,
      unreadQuotes,
      unreadContacts,
      todaySubmissions,
      totalSubmissions: totalQuotes + totalContacts,
      websites: websites.filter(Boolean),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


/**
 * @desc    Update read/unread status of a submission
 * @route   PATCH /api/admin/submissions/:id/read
 * @access  Private (Admin)
 */
const toggleReadStatus = async (req, res) => {
  try {
    const { isRead } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });
    res.json(submission);
  } catch (error) {
    console.error('Error updating submission read status:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc    Delete a single submission
 * @route   DELETE /api/admin/submissions/:id
 * @access  Private (Admin)
 */
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });
    res.json({ message: 'Submission deleted successfully.' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc    Delete submissions in bulk (optionally by type)
 * @route   DELETE /api/admin/submissions
 * @access  Private (Admin)
 */
const bulkDeleteSubmissions = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    await Submission.deleteMany(filter);
    res.json({ message: 'Submissions deleted successfully.' });
  } catch (error) {
    console.error('Error bulk deleting submissions:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getSubmissions,
  getStats,
  toggleReadStatus,
  deleteSubmission,
  bulkDeleteSubmissions,
};
