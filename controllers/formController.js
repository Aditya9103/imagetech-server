const { validationResult } = require('express-validator');
const Submission = require('../models/Submission');

/**
 * @desc    Handle "Get a Quote" form submissions
 * @route   POST /api/forms/quote
 * @access  Public
 */
const submitQuote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, companyName, email, phone, productInterest, industry, message, sourceWebsite } = req.body;

    // Detect origin website if not explicitly provided
    let originSite = sourceWebsite;
    if (!originSite && req.headers.origin) {
      try {
        originSite = new URL(req.headers.origin).hostname.replace(/^www\./, '');
      } catch {}
    }

    const submission = new Submission({
      type: 'quote',
      fullName,
      companyName: companyName || '',
      email,
      phone,
      productInterest: productInterest || '',
      industry: industry || '',
      message,
      sourceWebsite: originSite || 'inkmixingroller.com',
    });

    await submission.save();
    res.status(201).json({ success: true, message: 'Quote request submitted successfully!' });
  } catch (error) {
    console.error('Error saving quote submission:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * @desc    Handle "Contact Us" form submissions
 * @route   POST /api/forms/contact
 * @access  Public
 */
const submitContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, companyName, email, phone, productInterest, industry, message, sourceWebsite } = req.body;

    // Detect origin website if not explicitly provided
    let originSite = sourceWebsite;
    if (!originSite && req.headers.origin) {
      try {
        originSite = new URL(req.headers.origin).hostname.replace(/^www\./, '');
      } catch {}
    }

    const submission = new Submission({
      type: 'contact',
      fullName,
      companyName: companyName || '',
      email,
      phone,
      productInterest: productInterest || '',
      industry: industry || '',
      message,
      sourceWebsite: originSite || 'inkmixingroller.com',
    });

    await submission.save();
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


module.exports = {
  submitQuote,
  submitContact,
};
