import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Trek A Tour API is running' });
});

// Get all active trips
app.get('/api/trips', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM trips WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get trip by slug or ID
app.get('/api/trips/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    
    const [rows] = await pool.execute(
      `SELECT * FROM trips WHERE ${isUUID ? 'id' : 'slug'} = ? LIMIT 1`,
      [slugOrId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Get trips by category
app.get('/api/trips/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM trips WHERE category = ? AND is_active = TRUE ORDER BY created_at DESC',
      [category]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching trips by category:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get recommended trips
app.get('/api/trips/recommended/all', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM trips WHERE is_active = TRUE AND is_recommended = TRUE ORDER BY recommendation_order ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recommended trips:', error);
    res.status(500).json({ error: 'Failed to fetch recommended trips' });
  }
});

// Get site content
app.get('/api/content/:pageType/:contentKey', async (req, res) => {
  try {
    const { pageType, contentKey } = req.params;
    const [rows] = await pool.execute(
      'SELECT content_value FROM site_content WHERE page_type = ? AND content_key = ? LIMIT 1',
      [pageType, contentKey]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(rows[0].content_value);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get recommendations content
app.get('/api/recommendations-content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM recommendations_content WHERE id = 1');
    
    if (rows.length === 0) {
      return res.json({
        title: 'Recommended Adventures',
        description: 'Handpicked experiences that our adventurers love most.'
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching recommendations content:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations content' });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { trip_id, name, email, phone, number_of_people, selected_date, message } = req.body;
    
    const id = crypto.randomUUID();
    
    await pool.execute(
      'INSERT INTO bookings (id, trip_id, name, email, phone, number_of_people, selected_date, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, trip_id, name, email, phone, number_of_people, selected_date, message]
    );
    
    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Admin: Create trip
app.post('/api/admin/trips', async (req, res) => {
  try {
    const trip = req.body;
    const id = crypto.randomUUID();
    
    await pool.execute(
      `INSERT INTO trips (id, title, slug, category, region, duration, base_price, original_price, 
       short_desc, image, image_url, difficulty, highlights, features, is_active, available_dates, 
       is_recommended, recommendation_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, trip.title, trip.slug, trip.category, trip.region, trip.duration,
        trip.base_price, trip.original_price, trip.short_desc, trip.image, trip.image_url,
        trip.difficulty, JSON.stringify(trip.highlights), JSON.stringify(trip.features),
        trip.is_active, JSON.stringify(trip.available_dates), trip.is_recommended,
        trip.recommendation_order
      ]
    );
    
    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Admin: Update trip
app.put('/api/admin/trips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const trip = req.body;
    
    await pool.execute(
      `UPDATE trips SET title=?, slug=?, category=?, region=?, duration=?, base_price=?, 
       original_price=?, short_desc=?, image=?, image_url=?, difficulty=?, highlights=?, 
       features=?, is_active=?, available_dates=?, is_recommended=?, recommendation_order=? 
       WHERE id=?`,
      [
        trip.title, trip.slug, trip.category, trip.region, trip.duration,
        trip.base_price, trip.original_price, trip.short_desc, trip.image, trip.image_url,
        trip.difficulty, JSON.stringify(trip.highlights), JSON.stringify(trip.features),
        trip.is_active, JSON.stringify(trip.available_dates), trip.is_recommended,
        trip.recommendation_order, id
      ]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Admin: Delete trip (soft delete)
app.delete('/api/admin/trips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE trips SET is_active = FALSE WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// Admin: Send OTP
app.post('/api/admin/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // Delete old OTPs for this email
    await pool.execute('DELETE FROM admin_otp WHERE email = ?', [email]);
    
    // Store new OTP
    await pool.execute(
      'INSERT INTO admin_otp (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );
    
    res.json({ success: true, otp }); // In production, don't return OTP, send via email
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Admin: Verify OTP
app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const [rows] = await pool.execute(
      'SELECT * FROM admin_otp WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [email, otp]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }
    
    // Delete used OTP
    await pool.execute('DELETE FROM admin_otp WHERE email = ?', [email]);
    
    res.json({ success: true, email });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Trek A Tour API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
