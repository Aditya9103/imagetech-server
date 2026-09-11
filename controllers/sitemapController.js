const Location = require('../models/Location');

// Multi-tenant configuration mapping each website domain to its base URL & product slugs
const SITES_CONFIG = {
  'inkmixingroller.com': {
    name: 'Ink Mixing Roller',
    domain: 'https://inkmixingroller.com',
    productSlugs: [
      'magnetic-ink-mixing-roller-with-rope',
      'wipex-magnetic-ink-mixing-roller-rope-free',
    ],
  },
  'stroboscopelight.com': {
    name: 'Stroboscope Light',
    domain: 'https://stroboscopelight.com',
    productSlugs: [
      'xenon-stroboscope-light',
      'led-stroboscope-light',
      'portable-rechargeable-stroboscope',
      'fixed-mount-industrial-stroboscope',
    ],
  },
  'barcoater.com': {
    name: 'Bar Coater',
    domain: 'https://barcoater.com',
    productSlugs: [
      'wire-wound-bar-coater',
      'mayer-rod-coater',
      'lab-hand-coater',
      'automatic-film-applicator-coater',
    ],
  },
  'teflondam.com': {
    name: 'Teflon Dam',
    domain: 'https://teflondam.com',
    productSlugs: [
      'teflon-dam-end-seals',
      'chamber-doctor-blade-end-seals',
      'felt-ink-dam-seals',
      'custom-machined-teflon-seals',
    ],
  },
  'doctorblade.co.in': {
    name: 'Doctor Blade',
    domain: 'https://doctorblade.co.in',
    productSlugs: [
      'carbon-steel-doctor-blade',
      'stainless-steel-doctor-blade',
      'ceramic-coated-doctor-blade',
      'lamella-edge-doctor-blade',
    ],
  },
  // Vercel deployment preview domains
  'teflon-dam.vercel.app': {
    name: 'Teflon Dam',
    domain: 'https://teflon-dam.vercel.app',
    productSlugs: [
      'teflon-dam-end-seals',
      'chamber-doctor-blade-end-seals',
      'felt-ink-dam-seals',
      'custom-machined-teflon-seals',
    ],
  },
  'doctor-blade.vercel.app': {
    name: 'Doctor Blade',
    domain: 'https://doctor-blade.vercel.app',
    productSlugs: [
      'carbon-steel-doctor-blade',
      'stainless-steel-doctor-blade',
      'ceramic-coated-doctor-blade',
      'lamella-edge-doctor-blade',
    ],
  },
  'magnetic-ink-mixing-roller.vercel.app': {
    name: 'Ink Mixing Roller',
    domain: 'https://magnetic-ink-mixing-roller.vercel.app',
    productSlugs: [
      'magnetic-ink-mixing-roller-with-rope',
      'wipex-magnetic-ink-mixing-roller-rope-free',
    ],
  },
  'bar-coater.vercel.app': {
    name: 'Bar Coater',
    domain: 'https://bar-coater.vercel.app',
    productSlugs: [
      'wire-wound-bar-coater',
      'mayer-rod-coater',
      'lab-hand-coater',
      'automatic-film-applicator-coater',
    ],
  },
  'stroboscope-blond.vercel.app': {
    name: 'Stroboscope Light',
    domain: 'https://stroboscope-blond.vercel.app',
    productSlugs: [
      'xenon-stroboscope-light',
      'led-stroboscope-light',
      'portable-rechargeable-stroboscope',
      'fixed-mount-industrial-stroboscope',
    ],
  },
};

/**
 * Resolves the target domain and configuration based on query param or incoming request headers
 */
const resolveSiteConfig = (req) => {
  // 1. Check explicit query param (e.g. ?domain=stroboscopelight.com)
  let requestedDomain = req.query.domain || req.params.domain;

  // 2. If not in query, check Referer or Origin header
  if (!requestedDomain) {
    const origin = req.headers.origin || req.headers.referer;
    if (origin) {
      try {
        requestedDomain = new URL(origin).hostname.replace(/^www\./, '');
      } catch {}
    }
  }

  // 3. If still not found, check Host or X-Forwarded-Host
  if (!requestedDomain) {
    const host = req.headers['x-forwarded-host'] || req.get('host') || '';
    requestedDomain = host.split(':')[0].replace(/^www\./, '');
  }

  // Normalize requested domain
  requestedDomain = requestedDomain ? requestedDomain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '') : '';

  // Match against known sites
  if (requestedDomain && SITES_CONFIG[requestedDomain]) {
    return {
      key: requestedDomain,
      ...SITES_CONFIG[requestedDomain],
    };
  }

  // If unknown domain passed via query param, build dynamic config
  if (requestedDomain && requestedDomain !== 'localhost' && !requestedDomain.includes('127.0.0.1')) {
    return {
      key: requestedDomain,
      name: requestedDomain,
      domain: `https://${requestedDomain}`,
      productSlugs: req.query.products ? req.query.products.split(',').map(s => s.trim()) : SITES_CONFIG['inkmixingroller.com'].productSlugs,
    };
  }

  // Fallback to default inkmixingroller.com or env
  const defaultDomain = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : 'https://inkmixingroller.com';
  return {
    key: 'inkmixingroller.com',
    ...SITES_CONFIG['inkmixingroller.com'],
    domain: defaultDomain,
  };
};

/**
 * @desc    Generate dynamic sitemap.xml for SEO indexing across all websites
 * @route   GET /sitemap.xml
 * @route   GET /sitemaps/:domain.xml
 * @access  Public
 */
const getSitemapXml = async (req, res) => {
  try {
    const siteConfig = resolveSiteConfig(req);
    const locations = await Location.find({ isActive: true }).sort({ name: 1 });
    const baseUrl = siteConfig.domain;
    const today = new Date().toISOString().split('T')[0];

    // Allow override of product slugs via ?products=slug1,slug2
    const productSlugs = req.query.products
      ? req.query.products.split(',').map(s => s.trim()).filter(Boolean)
      : siteConfig.productSlugs;

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
  SITES_CONFIG,
};

