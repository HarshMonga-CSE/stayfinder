import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// Database setup
const db = new sqlite3.Database(':memory:');

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Initialize database
const initializeDatabase = () => {
  // Users table
  db.run(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      isHost BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Properties table
  db.run(`
    CREATE TABLE properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      price INTEGER NOT NULL,
      rating REAL DEFAULT 4.5,
      reviews INTEGER DEFAULT 0,
      images TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      amenities TEXT,
      bedrooms INTEGER DEFAULT 1,
      bathrooms INTEGER DEFAULT 1,
      maxGuests INTEGER DEFAULT 2,
      hostId TEXT NOT NULL,
      hostName TEXT NOT NULL,
      hostImage TEXT DEFAULT 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      hostSince TEXT DEFAULT '2020',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hostId) REFERENCES users (id)
    )
  `);

  // Bookings table
  db.run(`
    CREATE TABLE bookings (
      id TEXT PRIMARY KEY,
      propertyId TEXT NOT NULL,
      userId TEXT NOT NULL,
      checkIn TEXT NOT NULL,
      checkOut TEXT NOT NULL,
      guests INTEGER NOT NULL,
      totalPrice INTEGER NOT NULL,
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (propertyId) REFERENCES properties (id),
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  // Insert sample data
  insertSampleData();
};

const insertSampleData = () => {
  const sampleUsers = [
    {
      id: 'user-guest-1',
      name: 'Guest User',
      email: 'guest@stayfinder.com',
      password: bcrypt.hashSync('password123', 10),
      isHost: 0
    },
    {
      id: 'host-1',
      name: 'Sarah Johnson',
      email: 'host@stayfinder.com',
      password: bcrypt.hashSync('password123', 10),
      isHost: 1
    },
    {
      id: 'host-2',
      name: 'Michael Chen',
      email: 'michael@stayfinder.com',
      password: bcrypt.hashSync('password123', 10),
      isHost: 1
    }
  ];

  sampleUsers.forEach(user => {
    db.run(
      'INSERT INTO users (id, name, email, password, isHost) VALUES (?, ?, ?, ?, ?)',
      [user.id, user.name, user.email, user.password, user.isHost]
    );
  });

  const sampleProperties = [
    {
      id: 'prop-1',
      title: 'Modern Downtown Loft',
      location: 'New York, NY',
      price: 180,
      rating: 4.8,
      reviews: 127,
      images: JSON.stringify([
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]),
      type: 'Apartment',
      description: 'A beautiful modern loft in the heart of downtown NYC. Perfect for business travelers and couples looking for a stylish stay.',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'TV', 'Air Conditioning']),
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      hostId: 'host-1',
      hostName: 'Sarah Johnson'
    },
    {
      id: 'prop-2',
      title: 'Cozy Beach House',
      location: 'Malibu, CA',
      price: 250,
      rating: 4.9,
      reviews: 89,
      images: JSON.stringify([
        'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1267550/pexels-photo-1267550.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]),
      type: 'House',
      description: 'Wake up to ocean views in this charming beach house. Just steps from the beach with all the amenities you need.',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Parking', 'TV']),
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      hostId: 'host-2',
      hostName: 'Michael Chen'
    },
    {
      id: 'prop-3',
      title: 'Urban Studio Apartment',
      location: 'San Francisco, CA',
      price: 120,
      rating: 4.6,
      reviews: 73,
      images: JSON.stringify([
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]),
      type: 'Studio',
      description: 'Compact and efficient studio in the heart of San Francisco. Perfect for solo travelers.',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'TV']),
      bedrooms: 0,
      bathrooms: 1,
      maxGuests: 2,
      hostId: 'host-1',
      hostName: 'Sarah Johnson'
    },
    {
      id: 'prop-4',
      title: 'Luxury Villa with Pool',
      location: 'Miami, FL',
      price: 450,
      rating: 4.9,
      reviews: 156,
      images: JSON.stringify([
        'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1862402/pexels-photo-1862402.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]),
      type: 'Villa',
      description: 'Stunning luxury villa with private pool and garden. Perfect for groups and special occasions.',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning']),
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      hostId: 'host-2',
      hostName: 'Michael Chen'
    },
    {
      id: 'prop-5',
      title: 'Mountain Cabin Retreat',
      location: 'Aspen, CO',
      price: 200,
      rating: 4.7,
      reviews: 94,
      images: JSON.stringify([
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]),
      type: 'House',
      description: 'Escape to the mountains in this cozy cabin. Perfect for skiing and outdoor adventures.',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Parking', 'Heating']),
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      hostId: 'host-1',
      hostName: 'Sarah Johnson'
    },
    {
      id: 'prop-6',
      title: 'Historic Brownstone',
      location: 'Boston, MA',
      price: 160,
      rating: 4.5,
      reviews: 112,
      images: JSON.stringify([
        'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]),
      type: 'Apartment',
      description: 'Beautiful historic brownstone apartment in Boston\'s Back Bay. Walking distance to major attractions.',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'TV', 'Heating']),
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      hostId: 'host-2',
      hostName: 'Michael Chen'
    }
  ];

  sampleProperties.forEach(property => {
    db.run(
      `INSERT INTO properties (
        id, title, location, price, rating, reviews, images, type, description,
        amenities, bedrooms, bathrooms, maxGuests, hostId, hostName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        property.id, property.title, property.location, property.price, property.rating,
        property.reviews, property.images, property.type, property.description,
        property.amenities, property.bedrooms, property.bathrooms, property.maxGuests,
        property.hostId, property.hostName
      ]
    );
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, isHost = false } = req.body;

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
      const userId = 'user-' + Date.now();

      // Insert new user
      db.run(
        'INSERT INTO users (id, name, email, password, isHost) VALUES (?, ?, ?, ?, ?)',
        [userId, name, email, hashedPassword, isHost ? 1 : 0],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Failed to create user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: userId, email, name, isHost },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: userId, name, email, isHost }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, isHost: user.isHost },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isHost: user.isHost
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Properties routes
app.get('/api/properties', (req, res) => {
  db.all('SELECT * FROM properties WHERE status = "active"', (err, properties) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    const formattedProperties = properties.map(property => ({
      ...property,
      images: JSON.parse(property.images),
      amenities: JSON.parse(property.amenities)
    }));

    res.json(formattedProperties);
  });
});

app.get('/api/properties/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM properties WHERE id = ?', [id], (err, property) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const formattedProperty = {
      ...property,
      images: JSON.parse(property.images),
      amenities: JSON.parse(property.amenities)
    };

    res.json(formattedProperty);
  });
});

// Host routes
app.get('/api/host/properties', authenticateToken, (req, res) => {
  if (!req.user.isHost) {
    return res.status(403).json({ message: 'Access denied. Host account required.' });
  }

  db.all('SELECT * FROM properties WHERE hostId = ?', [req.user.id], (err, properties) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    const formattedProperties = properties.map(property => ({
      ...property,
      images: JSON.parse(property.images),
      amenities: JSON.parse(property.amenities)
    }));

    res.json(formattedProperties);
  });
});

app.post('/api/host/properties', authenticateToken, (req, res) => {
  if (!req.user.isHost) {
    return res.status(403).json({ message: 'Access denied. Host account required.' });
  }

  const {
    title, location, price, type, description, bedrooms, bathrooms, maxGuests, amenities
  } = req.body;

  const propertyId = 'prop-' + Date.now();
  const sampleImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  db.run(
    `INSERT INTO properties (
      id, title, location, price, type, description, bedrooms, bathrooms,
      maxGuests, amenities, images, hostId, hostName
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      propertyId, title, location, price, type, description, bedrooms, bathrooms,
      maxGuests, JSON.stringify(amenities), JSON.stringify(sampleImages),
      req.user.id, req.user.name
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create property' });
      }

      res.status(201).json({ message: 'Property created successfully', id: propertyId });
    }
  );
});

app.delete('/api/host/properties/:id', authenticateToken, (req, res) => {
  if (!req.user.isHost) {
    return res.status(403).json({ message: 'Access denied. Host account required.' });
  }

  const { id } = req.params;

  db.run(
    'DELETE FROM properties WHERE id = ? AND hostId = ?',
    [id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Property not found' });
      }

      res.json({ message: 'Property deleted successfully' });
    }
  );
});

app.get('/api/host/bookings', authenticateToken, (req, res) => {
  if (!req.user.isHost) {
    return res.status(403).json({ message: 'Access denied. Host account required.' });
  }

  const query = `
    SELECT b.*, p.title as propertyTitle, u.name as guestName
    FROM bookings b
    JOIN properties p ON b.propertyId = p.id
    JOIN users u ON b.userId = u.id
    WHERE p.hostId = ?
    ORDER BY b.created_at DESC
  `;

  db.all(query, [req.user.id], (err, bookings) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(bookings);
  });
});

// Booking routes
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { propertyId, checkIn, checkOut, guests, totalPrice } = req.body;
  const bookingId = 'booking-' + Date.now();

  db.run(
    'INSERT INTO bookings (id, propertyId, userId, checkIn, checkOut, guests, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [bookingId, propertyId, req.user.id, checkIn, checkOut, guests, totalPrice],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create booking' });
      }

      res.status(201).json({ message: 'Booking created successfully', id: bookingId });
    }
  );
});

app.get('/api/bookings/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT b.*, p.title as propertyTitle, p.location as propertyLocation, 
           p.images as propertyImage, u.name as guestName
    FROM bookings b
    JOIN properties p ON b.propertyId = p.id
    JOIN users u ON b.userId = u.id
    WHERE b.id = ? AND (b.userId = ? OR p.hostId = ?)
  `;

  db.get(query, [id, req.user.id, req.user.id], (err, booking) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const propertyImages = JSON.parse(booking.propertyImage);
    const formattedBooking = {
      ...booking,
      propertyImage: propertyImages[0]
    };

    res.json(formattedBooking);
  });
});

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});