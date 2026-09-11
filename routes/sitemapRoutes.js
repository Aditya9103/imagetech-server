const express = require('express');
const router = express.Router();
const { getSitemapXml } = require('../controllers/sitemapController');

// GET /sitemap.xml (supports ?domain=stroboscopelight.com or auto-detected domain)
router.get('/sitemap.xml', getSitemapXml);

// GET /sitemaps/:domain.xml (e.g. /sitemaps/stroboscopelight.com.xml)
router.get('/sitemaps/:domain.xml', getSitemapXml);

module.exports = router;

