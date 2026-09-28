const Blog = require('../models/Blog');

/**
 * Helper to generate URL-safe slug from title
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Helper to calculate estimated read time
 */
const calculateReadTime = (content) => {
  if (!content) return '3 min read';
  const cleanText = content.replace(/<[^>]*>?/gm, '');
  const wordCount = cleanText.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${Math.max(1, minutes)} min read`;
};

/**
 * Helper to extract Table of Contents from markdown/HTML headings if not provided
 */
const extractToc = (content) => {
  if (!content) return [];
  const headings = [];
  // Match markdown ## and ### or html <h2> and <h3>
  const mdRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);
    headings.push({ id, text, level });
  }

  if (headings.length === 0) {
    const htmlRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
    while ((match = htmlRegex.exec(content)) !== null) {
      const level = parseInt(match[1], 10);
      const text = match[2].replace(/<[^>]*>?/gm, '').trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }
  }

  return headings;
};

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC CONTROLLER METHODS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * @desc Get published blogs for a specific website
 * @route GET /api/blogs
 * @access Public
 */
exports.getBlogs = async (req, res) => {
  try {
    const {
      site,
      category,
      search,
      page = 1,
      limit = 9,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Filter for multi-tenant website match or 'all'
    const query = {
      isPublished: true,
      ...(site ? { targetWebsites: { $in: [site, 'all'] } } : {}),
    };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { keywords: searchRegex },
      ];
    }

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .select(
          'title slug category excerpt featuredImage imageAlt readTime publishedAt author views'
        )
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Blog.countDocuments(query),
    ]);

    // Also get all distinct categories for this site to populate filter tabs
    const categories = await Blog.distinct('category', {
      isPublished: true,
      ...(site ? { targetWebsites: { $in: [site, 'all'] } } : {}),
    });

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
      categories,
    });
  } catch (error) {
    console.error('getBlogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};

/**
 * @desc Get a single blog by slug with full content and related articles
 * @route GET /api/blogs/:slug
 * @access Public
 */
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { site } = req.query;

    const siteFilter = site ? { targetWebsites: { $in: [site, 'all'] } } : {};

    const blog = await Blog.findOne({
      slug: slug.toLowerCase(),
      isPublished: true,
      ...siteFilter,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment views asynchronously without blocking response
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    // Fetch up to 3 related articles
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      isPublished: true,
      category: blog.category,
      ...siteFilter,
    })
      .select('title slug category excerpt featuredImage publishedAt readTime')
      .limit(3)
      .lean();

    // If fewer than 3 in same category, fill with latest
    if (relatedBlogs.length < 3) {
      const existingIds = [blog._id, ...relatedBlogs.map((b) => b._id)];
      const fillers = await Blog.find({
        _id: { $nin: existingIds },
        isPublished: true,
        ...siteFilter,
      })
        .select('title slug category excerpt featuredImage publishedAt readTime')
        .sort({ publishedAt: -1 })
        .limit(3 - relatedBlogs.length)
        .lean();

      relatedBlogs.push(...fillers);
    }

    res.json({
      success: true,
      blog,
      relatedBlogs,
    });
  } catch (error) {
    console.error('getBlogBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch article' });
  }
};

/**
 * @desc Get categories and count for a website
 * @route GET /api/blogs/categories
 * @access Public
 */
exports.getBlogCategories = async (req, res) => {
  try {
    const { site } = req.query;

    const categoriesWithCount = await Blog.aggregate([
      {
        $match: {
          isPublished: true,
          ...(site ? { targetWebsites: { $in: [site, 'all'] } } : {}),
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      categories: categoriesWithCount.map((c) => ({
        name: c._id,
        count: c.count,
      })),
    });
  } catch (error) {
    console.error('getBlogCategories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN CONTROLLER METHODS (Protected by JWT)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * @desc Admin: Fetch all blogs (published and drafts)
 * @route GET /api/blogs/admin/all
 * @access Admin Protected
 */
exports.adminGetBlogs = async (req, res) => {
  try {
    const { site, search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (site && site !== 'all') {
      query.targetWebsites = { $in: [site, 'all'] };
    }

    if (status === 'published') query.isPublished = true;
    if (status === 'draft') query.isPublished = false;

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { slug: regex }, { category: regex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('adminGetBlogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin blogs' });
  }
};

/**
 * @desc Admin: Fetch single blog by ID for editing
 * @route GET /api/blogs/admin/:id
 * @access Admin Protected
 */
exports.adminGetBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error('adminGetBlogById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog post' });
  }
};

/**
 * @desc Admin: Create a new blog post
 * @route POST /api/blogs/admin
 * @access Admin Protected
 */
exports.adminCreateBlog = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Auto-generate slug if not provided
    if (!data.slug || !data.slug.trim()) {
      data.slug = slugify(data.title);
    } else {
      data.slug = slugify(data.slug);
    }

    // Check slug collision
    const existing = await Blog.findOne({ slug: data.slug });
    if (existing) {
      data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }

    // Auto-calculate reading time if missing
    if (!data.readTime && data.content) {
      data.readTime = calculateReadTime(data.content);
    }

    // Auto-extract TOC headings if not provided
    if ((!data.toc || data.toc.length === 0) && data.content) {
      data.toc = extractToc(data.content);
    }

    // Ensure metaTitle & metaDescription exist
    if (!data.metaTitle) {
      data.metaTitle = `${data.title} | ImageTech Industries`;
    }
    if (!data.metaDescription && data.excerpt) {
      data.metaDescription = data.excerpt.slice(0, 160);
    }

    const blog = new Blog(data);
    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog post published successfully',
      blog,
    });
  } catch (error) {
    console.error('adminCreateBlog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create blog post',
    });
  }
};

/**
 * @desc Admin: Update an existing blog post
 * @route PUT /api/blogs/admin/:id
 * @access Admin Protected
 */
exports.adminUpdateBlog = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.slug) {
      data.slug = slugify(data.slug);
      const existing = await Blog.findOne({
        slug: data.slug,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: 'Slug is already in use by another post' });
      }
    }

    // Recalculate readTime if content changed and readTime not manually provided
    if (data.content && !data.readTime) {
      data.readTime = calculateReadTime(data.content);
    }

    // Recalculate TOC if content updated and toc not provided
    if (data.content && (!data.toc || data.toc.length === 0)) {
      data.toc = extractToc(data.content);
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      blog,
    });
  } catch (error) {
    console.error('adminUpdateBlog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update blog post',
    });
  }
};

/**
 * @desc Admin: Delete a blog post
 * @route DELETE /api/blogs/admin/:id
 * @access Admin Protected
 */
exports.adminDeleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('adminDeleteBlog error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog post' });
  }
};

/**
 * @desc Admin: Toggle publish status
 * @route PATCH /api/blogs/admin/:id/publish
 * @access Admin Protected
 */
exports.adminTogglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    blog.isPublished = !blog.isPublished;
    if (blog.isPublished && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
    await blog.save();

    res.json({
      success: true,
      message: `Blog post ${blog.isPublished ? 'published' : 'moved to draft'}`,
      isPublished: blog.isPublished,
    });
  } catch (error) {
    console.error('adminTogglePublish error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle publish status' });
  }
};
