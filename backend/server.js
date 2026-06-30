const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const jobRoutes = require('./routes/jobRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/dispute', disputeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Escrow Platform Backend Running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
