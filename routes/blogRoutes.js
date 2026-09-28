const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getBlogs,
  getBlogBySlug,
  getBlogCategories,
  adminGetBlogs,
  adminGetBlogById,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog,
  adminTogglePublish,
} = require('../controllers/blogController');

// ── Public Routes (Multi-tenant) ──
router.get('/', getBlogs);
router.get('/categories', getBlogCategories);
router.get('/:slug', getBlogBySlug);

// ── Admin Protected Routes (JWT required) ──
router.get('/admin/all', authenticateToken, adminGetBlogs);
router.get('/admin/:id', authenticateToken, adminGetBlogById);
router.post('/admin', authenticateToken, adminCreateBlog);
router.put('/admin/:id', authenticateToken, adminUpdateBlog);
router.delete('/admin/:id', authenticateToken, adminDeleteBlog);
router.patch('/admin/:id/publish', authenticateToken, adminTogglePublish);

module.exports = router;
