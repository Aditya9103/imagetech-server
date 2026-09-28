const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Multi-tenant targeting: which websites should display this blog
    targetWebsites: [
      {
        type: String,
        enum: [
          'all',
          'doctorblade.co.in',
          'imagetechindustries.com',
          'stroboscopelight.com',
          'barcoater.com',
          'teflondam.com',
          'inkmixingroller.com',
        ],
        default: ['doctorblade.co.in'],
        index: true,
      },
    ],
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: 350,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required'],
      trim: true,
    },
    imageAlt: {
      type: String,
      default: '',
      trim: true,
    },
    // Dynamic SEO Fields
    metaTitle: {
      type: String,
      required: [true, 'Meta title is required'],
      trim: true,
    },
    metaDescription: {
      type: String,
      required: [true, 'Meta description is required'],
      trim: true,
      maxlength: 175,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    canonicalUrl: {
      type: String,
      trim: true,
      default: '',
    },
    // Interactive & Schema Features
    toc: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        level: { type: Number, default: 2 },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true },
      },
    ],
    // Related Doctor Blade product slug for in-article conversion
    relatedProductSlug: {
      type: String,
      trim: true,
      default: 'wipex-carbon-steel-doctor-blade',
    },
    // Author Credentials
    author: {
      name: {
        type: String,
        default: 'ImageTech Engineering Team',
      },
      title: {
        type: String,
        default: 'Printing & Packaging Technical Specialist',
      },
      avatar: {
        type: String,
        default: 'https://www.doctorblade.co.in/logo-512x512.png',
      },
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
