require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const transactions = require('./routes/transactionRoutes');
const auth = require('./routes/auth');

connectDB(); // connect to db here

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('💰 Expense Tracker API is Running!');
});

app.use('/api/transactions', transactions);
app.use('/api/user', auth); 

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
