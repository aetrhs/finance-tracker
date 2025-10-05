const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please add a description for the transaction.']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number for the amount.'],
  },
  category: {
    type: String,
    enum: ['Food', 'Grocery', 'Trinkets', 'Income', 'Drinks', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    required: [true, 'Select the transaction date.'],
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);