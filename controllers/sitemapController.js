const Location = require('../models/Location');
const Blog = require('../models/Blog');

// Central product catalog baseline fallback (synchronized with api.imagetechindustries.com)
const BRAND_PRODUCTS = {
  'ink-mixing-roller': [
    'magnetic-ink-mixing-roller-with-rope',
    'wipex-magnetic-ink-mixing-roller-rope-free',
    'aluminium-magnetic-ink-mixing-roller',
    'spiral-wound-magnetic-ink-mixing-roller',
  ],
  'stroboscope': [
    'led-handheld-model-stroboscope',
    'led-handheld-model-stroboscope-with-lens',
    'xenon-flash-tube-hand-held-stroboscope',
    'u-tube-fixed-model-stroboscope',
    'xenon-flash-tube-for-stroboscope',
    'led-fix-model-stroboscope-iti-400',
  ],
  'bar-coater': [
    'bar-coaters-small-size',
    'bar-coaters-big-size',
  ],
  'teflon-dam': [
    'teflon-dam-for-nordmeccanica-super-simplex-super-combi',
    'teflon-dam-for-pelican',
    'teflon-dam-for-nordmeccanica-simplex',
    'teflon-dam-for-sai-converting',
    'teflon-dam-for-fadia',
    'teflon-dam-for-mamta-converting',
    'teflon-dam-for-lotus',
    'teflon-dam-for-st-engineering',
    'teflon-dam-for-expert-model-a',
    'teflon-dam-for-expert-model-b',
    'teflon-dam-for-canara-flex-model-a',
    'teflon-dam-for-kohli-210',
    'teflon-dam-for-kohli-220',
  ],
  'doctor-blade': [
    'wipex-carbon-steel-doctor-blade',
    'wipex-polymer-doctor-blade',
  ],
};

// Mapping of internal brand keys to ImageTech CMS category slugs
const BRAND_CATEGORY_MAP = {
  'ink-mixing-roller': 'magnetic-ink-mixing-rollers',
  'doctor-blade': 'doctor-blades',
  'stroboscope': 'stroboscopes',
  'bar-coater': 'bar-coaters',
  'teflon-dam': 'teflon-dam',
};

const IMAGETECH_PRODUCTS_API =
  process.env.IMAGETECH_API_URL
    ? `${process.env.IMAGETECH_API_URL.replace(/\/$/, '')}/products`
    : 'https://api.imagetechindustries.com/api/products';

// In-memory cache for dynamic products (1-hour TTL)
let productsCache = {
  data: null,
  timestamp: 0,
};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetch dynamic products from api.imagetechindustries.com with in-memory caching and timeout
 */
const getDynamicProductsFromApi = async () => {
  const now = Date.now();
  if (productsCache.data && now - productsCache.timestamp < CACHE_TTL_MS) {
    return productsCache.data;
  }

  try {
    console.log('[LIVE API] Fetching live products from:', IMAGETECH_PRODUCTS_API);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(IMAGETECH_PRODUCTS_API, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log(`[LIVE API SUCCESS] Successfully loaded ${data.length} live products directly from ImageTech CMS`);
        productsCache = {
          data,
          timestamp: now,
        };
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch dynamic products from ImageTech API, using fallback:', err.message);
  }

  return productsCache.data || [];
};

/**
 * Dynamically resolves the product slugs for any site:
 * 1. Query override (?products=slug1,slug2)
 * 2. Dynamic fetch from https://api.imagetechindustries.com/api/products
 * 3. Fallback to baseline BRAND_PRODUCTS
 */
const resolveProductSlugs = async (domain, query = {}) => {
  if (query.products) {
    return query.products.split(',').map(s => s.trim()).filter(Boolean);
  }

  const cleanDomain = domain.toLowerCase();
  let brandKey = '';

  if (query.brand && BRAND_PRODUCTS[query.brand]) {
    brandKey = query.brand;
  } else if (cleanDomain.includes('blade')) {
    brandKey = 'doctor-blade';
  } else if (cleanDomain.includes('dam')) {
    brandKey = 'teflon-dam';
  } else if (cleanDomain.includes('stroboscope')) {
    brandKey = 'stroboscope';
  } else if (cleanDomain.includes('coater')) {
    brandKey = 'bar-coater';
  } else if (cleanDomain.includes('roller') || cleanDomain.includes('mixing')) {
    brandKey = 'ink-mixing-roller';
  }

  const targetCategorySlug = BRAND_CATEGORY_MAP[brandKey];

  // Attempt dynamic fetch from central API
  if (targetCategorySlug) {
    try {
      const allApiProducts = await getDynamicProductsFromApi();
      if (Array.isArray(allApiProducts) && allApiProducts.length > 0) {
        const matched = allApiProducts.filter(p => {
          const catSlug = p.category?.slug || (typeof p.category === 'string' ? p.category : '');
          const catName = (p.category?.name || '').toLowerCase();
          return (
            catSlug === targetCategorySlug ||
            catSlug.includes(targetCategorySlug) ||
            catName.includes(brandKey.replace(/-/g, ' '))
          );
        });

        const dynamicSlugs = matched.map(p => p.slug).filter(Boolean);
        if (dynamicSlugs.length > 0) {
          return dynamicSlugs;
        }
      }
    } catch (e) {
      console.warn('Error matching dynamic products for sitemap:', e.message);
    }
  }

  // Fallback to baseline catalog only if API is completely offline/unreachable
  return BRAND_PRODUCTS[brandKey] || [];
};

/**
 * Normalizes a URL to ensure canonical www format across all custom domains
 * e.g. https://doctorblade.co.in -> https://www.doctorblade.co.in
 * e.g. doctorblade.co.in -> https://www.doctorblade.co.in
 * e.g. https://www.doctorblade.co.in -> https://www.doctorblade.co.in
 * Preserves localhost, IP addresses, and vercel preview domains (.vercel.app)
 */
const formatToWwwUrl = (rawUrl) => {
  if (!rawUrl) return '';
  let urlStr = rawUrl.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = `https://${urlStr}`;
  }

  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();

    // Do not add www to localhost, 127.0.0.1, or .vercel.app preview subdomains
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost');
    const isVercel = hostname.endsWith('.vercel.app');
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    if (!isLocal && !isVercel && !isIp) {
      if (!hostname.startsWith('www.')) {
        parsed.hostname = `www.${hostname}`;
      }
      parsed.protocol = 'https:';
    }

    return parsed.origin;
  } catch {
    return urlStr;
  }
};

/**
 * Uniformly resolves the base URL for any calling client in canonical www format
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
      } catch { }
    }
  }

  // 3. Detect from Host header (only if host is a real custom website domain, not backend hosting like onrender)
  if (!target) {
    const host = req.headers['x-forwarded-host'] || req.get('host');
    if (
      host &&
      !host.includes('localhost') &&
      !host.includes('127.0.0.1') &&
      !host.includes('onrender.com') &&
      !host.includes('render.com') &&
      !host.includes('railway.app') &&
      !host.includes('fly.dev')
    ) {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      target = `${proto}://${host}`;
    }
  }

  // 4. Fallback to production domain in CLIENT_URL (.env) if valid
  if (!target && process.env.CLIENT_URL) {
    const urls = process.env.CLIENT_URL.split(',').map(u => u.trim());
    target = urls.find(u => !u.includes('localhost') && !u.includes('127.0.0.1') && !u.includes('onrender.com'));
  }

  return target ? formatToWwwUrl(target) : null;
};

/**
 * @desc    Generate dynamic sitemap.xml for SEO indexing across all websites (canonical www format)
 * @route   GET /sitemap.xml
 * @route   GET /sitemaps/:domain.xml
 * @access  Public
 */
const getSitemapXml = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const baseUrl = resolveBaseUrl(req);

    if (!baseUrl) {
      return res.status(400).send('Domain parameter is required (e.g. /sitemap.xml?domain=www.inkmixingroller.com)');
    }
    const domainName = new URL(baseUrl).hostname.replace(/^www\./, '');
    const productSlugs = await resolveProductSlugs(domainName, req.query);
    const locations = await Location.find({ isActive: true }).sort({ name: 1 });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Primary pages (Home & About)
    const primaryPages = ['/', '/about'];
    for (const page of primaryPages) {
      xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    }

    // 2. Base Product pages (placed immediately after Home & About)
    for (const slug of productSlugs) {
      xml += `  <url>\n    <loc>${baseUrl}/products/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // 3. Blog Hub and individual blog posts (Priority 0.8)
    xml += `  <url>\n    <loc>${baseUrl}/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    const blogs = await Blog.find({
      isPublished: true,
      targetWebsites: { $in: [domainName, `www.${domainName}`, 'all'] },
    }).select('slug updatedAt');

    for (const b of blogs) {
      const blogDate = (b.updatedAt || new Date()).toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <lastmod>${blogDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // 4. Secondary static pages (Certifications, Contact, Guides, Policies, Sitemap)
    const secondaryPages = [
      '/certifications',
      '/contact',
      '/selection-guide',
      '/troubleshooting-guide',
      '/working-principle',
      '/press-applications',
      '/privacy-policy',
      '/terms-and-conditions',
      '/shipping-policy',
      '/sitemap',
    ];
    for (const page of secondaryPages) {
      xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
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
  formatToWwwUrl,
  resolveBaseUrl,
  resolveProductSlugs,
};
