const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Using bcrypt instead of bcryptjs
const dotenv = require('dotenv');

dotenv.config(); // Load .env early
console.log('MONGO_URI:', process.env.MONGO_URI); // Debug log
const app = express();
app.use(cors());
app.use(express.json());

// Suppress Mongoose strictQuery warning
mongoose.set('strictQuery', false);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  console.log('Register request:', { email }); // Debug log
  try {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    console.log('Existing user:', existingUser); // Debug log
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: normalizedEmail, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error); // Debug log
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email }); // Debug log
  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    console.log('Found user:', user); // Debug log
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error); // Debug log
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile endpoint (protected)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User endpoint (for dashboard, matching server.js)
app.get('/api/user', async (req, res) => {
  try {
    console.log('Received /api/user request');
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }
    console.log('Verifying token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found for userId:', decoded.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.email);
    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error('Error in /api/user:', err.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));