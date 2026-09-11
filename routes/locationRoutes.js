const express = require('express');
const router = express.Router();
const {
  getActiveLocations,
  getAllLocations,
  getLocationBySlug,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

// Public routes
router.get('/', getActiveLocations);
router.get('/all', getAllLocations);
router.get('/:slug', getLocationBySlug);

// Mutation routes
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;
