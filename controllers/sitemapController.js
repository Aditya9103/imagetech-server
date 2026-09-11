const Location = require('../models/Location');

// Central product catalog organized by brand category
const BRAND_PRODUCTS = {
  'ink-mixing-roller': [
    'magnetic-ink-mixing-roller-with-rope',
    'wipex-magnetic-ink-mixing-roller-rope-free',
  ],
  'stroboscope': [
    'xenon-stroboscope-light',
    'led-stroboscope-light',
    'portable-rechargeable-stroboscope',
    'fixed-mount-industrial-stroboscope',
  ],
  'bar-coater': [
    'wire-wound-bar-coater',
    'mayer-rod-coater',
    'lab-hand-coater',
    'automatic-film-applicator-coater',
  ],
  'teflon-dam': [
    'teflon-dam-end-seals',
    'chamber-doctor-blade-end-seals',
    'felt-ink-dam-seals',
    'custom-machined-teflon-seals',
  ],
  'doctor-blade': [
    'carbon-steel-doctor-blade',
    'stainless-steel-doctor-blade',
    'ceramic-coated-doctor-blade',
    'lamella-edge-doctor-blade',
  ],
};

/**
 * Uniformly resolves the product slugs for any site:
 * 1. Query override (?products=slug1,slug2)
 * 2. Brand category query (?brand=doctor-blade)
 * 3. Automatic keyword detection from the requesting domain
 */
const resolveProductSlugs = (domain, query = {}) => {
  if (query.products) {
    return query.products.split(',').map(s => s.trim()).filter(Boolean);
  }

  if (query.brand && BRAND_PRODUCTS[query.brand]) {
    return BRAND_PRODUCTS[query.brand];
  }

  const cleanDomain = domain.toLowerCase();
  if (cleanDomain.includes('blade')) return BRAND_PRODUCTS['doctor-blade'];
  if (cleanDomain.includes('dam')) return BRAND_PRODUCTS['teflon-dam'];
  if (cleanDomain.includes('stroboscope')) return BRAND_PRODUCTS['stroboscope'];
  if (cleanDomain.includes('coater')) return BRAND_PRODUCTS['bar-coater'];
  if (cleanDomain.includes('roller') || cleanDomain.includes('mixing')) return BRAND_PRODUCTS['ink-mixing-roller'];

  return [];
};

/**
 * Uniformly resolves the base URL for any calling client
 */
const resolveBaseUrl = (req) => {
  // 1. Explicit domain in query or route param: ?domain=... or /sitemaps/:domain.xml
  let target = req.query.domain || req.query.url || req.params.domain;

  // 2. Detect from Origin or Referer header
  if (!target) {
    const origin = req.headers.origin || req.headers.referer;
    if (origin) {
      try {
        const parsed = new URL(origin);
        target = `${parsed.protocol}//${parsed.host}`;
      } catch {}
    }
  }

  // 3. Detect from Host header
  if (!target) {
    const host = req.headers['x-forwarded-host'] || req.get('host');
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      target = `${proto}://${host}`;
    }
  }

  // 4. Fallback to first CLIENT_URL in .env
  if (!target && process.env.CLIENT_URL) {
    target = process.env.CLIENT_URL.split(',')[0].trim();
  }

  if (!target) {
    target = 'https://imagetechindustries.com';
  }

  // Format cleanly
  target = target.trim().replace(/\/$/, '');
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  return target;
};

/**
 * @desc    Generate dynamic sitemap.xml for SEO indexing across all websites
 * @route   GET /sitemap.xml
 * @route   GET /sitemaps/:domain.xml
 * @access  Public
 */
const getSitemapXml = async (req, res) => {
  try {
    const baseUrl = resolveBaseUrl(req);
    const domainName = new URL(baseUrl).hostname.replace(/^www\./, '');
    const productSlugs = resolveProductSlugs(domainName, req.query);
    const locations = await Location.find({ isActive: true }).sort({ name: 1 });
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Static pages
    const staticPages = [
      '/',
      '/about',
      '/certifications',
      '/contact',
      '/privacy-policy',
      '/terms-and-conditions',
      '/shipping-policy',
      '/sitemap',
    ];
    for (const page of staticPages) {
      xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    }

    // 2. Base Product pages
    for (const slug of productSlugs) {
      xml += `  <url>\n    <loc>${baseUrl}/products/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // 3. Programmatic City pages (/:city)
    for (const loc of locations) {
      xml += `  <url>\n    <loc>${baseUrl}/${loc.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // 4. Programmatic City + Product pages (/:city/:productSlug)
    for (const loc of locations) {
      for (const slug of productSlugs) {
        xml += `  <url>\n    <loc>${baseUrl}/${loc.slug}/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap XML:', error);
    res.status(500).end();
  }
};

module.exports = {
  getSitemapXml,
  BRAND_PRODUCTS,
  resolveBaseUrl,
  resolveProductSlugs,
};
