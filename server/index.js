const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'https://muddassir-04.github.io',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// User Schema and Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Expense Schema and Model
const ExpenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
});

const Expense = mongoose.model('Expense', ExpenseSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Register Endpoint
app.post('/api/register', async (req, res) => {
  console.log('Received /api/register request');
  console.log('Request body:', req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.status(201).json({ token, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in /api/register:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  console.log('Received /api/login request');
  console.log('Request body:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log('User found:', user ? user : 'No user found');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials - User not found' });
    }
    console.log('Comparing passwords:', { stored: user.password, provided: password });
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials - Password mismatch' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Error in /api/login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Endpoint
app.get('/api/user', verifyToken, async (req, res) => {
  console.log('Received /api/user request');
  console.log('Verifying token:', req.headers.authorization?.split(' ')[1]);
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log('User found:', user.email);
    res.status(200).json({ email: user.email });
  } catch (error) {
    console.error('Error in /api/user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Expense Endpoint
app.post('/api/expenses', verifyToken, async (req, res) => {
  console.log('Received /api/expenses POST request');
  console.log('Request body:', req.body);
  try {
    const { amount, category, description } = req.body;
    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount and category are required' });
    }
    const expense = new Expense({
      userId: req.user.userId,
      amount,
      category,
      description,
    });
    await expense.save();
    console.log('Expense added:', expense);
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error('Error in /api/expenses POST:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch Expenses Endpoint
app.get('/api/expenses', verifyToken, async (req, res) => {
  console.log('Received /api/expenses GET request');
  try {
    const expenses = await Expense.find({ userId: req.user.userId });
    console.log('Expenses fetched:', expenses);
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error in /api/expenses GET:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));