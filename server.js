require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const adminRoutes = require('./routes/adminRoutes');
const locationRoutes = require('./routes/locationRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "",
    "https://inkmixingroller.com",
    "https://www.inkmixingroller.com",
    "https://stroboscopelight.com",
    "https://www.stroboscopelight.com",
    "https://barcoater.com",
    "https://www.barcoater.com",
    "https://teflondam.com",
    "https://www.teflondam.com",
    "https://doctorblade.co.in",
    "https://www.doctorblade.co.in",
    "https://teflon-dam.vercel.app",
    "https://doctor-blade.vercel.app",
    "https://magnetic-ink-mixing-roller.vercel.app",
    "https://bar-coater.vercel.app",
    "https://stroboscope-blond.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    /\.vercel\.app$/
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);

// Sitemap XML Route
app.use('/', sitemapRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ImageTech Central Multi-Tenant API is running' });
});

// 404 Handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

module.exports = app;
