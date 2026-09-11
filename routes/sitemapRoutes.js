const express = require('express');
const router = express.Router();
const { getSitemapXml } = require('../controllers/sitemapController');

// GET /sitemap.xml (supports ?domain=... or auto-detected domain from Origin/Host)
router.get('/sitemap.xml', getSitemapXml);

// GET /sitemaps/:domain.xml (e.g. /sitemaps/doctorblade.co.in.xml)
router.get('/sitemaps/:domain.xml', getSitemapXml);

module.exports = router;

