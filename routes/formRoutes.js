const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { submitQuote, submitContact } = require('../controllers/formController');

// Validation rules
const formValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  body('message').trim().notEmpty().withMessage('Message is required.'),
];

// Form routes
router.post('/quote', formValidation, submitQuote);
router.post('/contact', formValidation, submitContact);

module.exports = router;
