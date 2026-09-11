const Location = require('../models/Location');

/**
 * @desc    Get all active locations (sorted alphabetically)
 * @route   GET /api/locations
 * @access  Public
 */
const getActiveLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ name: 1 });
    res.json(locations);
  } catch (err) {
    console.error('Error fetching active locations:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get all locations (active and inactive) for admin management
 * @route   GET /api/locations/all
 * @access  Public / Admin
 */
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ state: 1, name: 1 });
    res.json(locations);
  } catch (err) {
    console.error('Error fetching all locations:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get a single location by slug
 * @route   GET /api/locations/:slug
 * @access  Public
 */
const getLocationBySlug = async (req, res) => {
  try {
    const location = await Location.findOne({ slug: req.params.slug, isActive: true });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    console.error('Error fetching location by slug:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new location/city
 * @route   POST /api/locations
 * @access  Admin / Public API
 */
const createLocation = async (req, res) => {
  try {
    const { name, slug, state, isActive = true } = req.body;

    if (!name || !state) {
      return res.status(400).json({ message: 'Name and State are required' });
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');

    const existing = await Location.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(409).json({ message: `Location with slug '${finalSlug}' already exists.` });
    }

    const newLocation = new Location({
      name: name.trim(),
      slug: finalSlug,
      state: state.trim(),
      isActive: Boolean(isActive),
    });

    await newLocation.save();
    res.status(201).json({
      message: 'City added successfully! It is immediately available across all programmatic pages.',
      location: newLocation,
    });
  } catch (err) {
    console.error('Error creating location:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update a location/city
 * @route   PUT /api/locations/:id
 * @access  Admin
 */
const updateLocation = async (req, res) => {
  try {
    const { name, slug, state, isActive } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (state !== undefined) updateData.state = state.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (slug !== undefined) {
      updateData.slug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }

    const updated = await Location.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location updated successfully', location: updated });
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Delete a location/city
 * @route   DELETE /api/locations/:id
 * @access  Admin
 */
const deleteLocation = async (req, res) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    console.error('Error deleting location:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getActiveLocations,
  getAllLocations,
  getLocationBySlug,
  createLocation,
  updateLocation,
  deleteLocation,
};
