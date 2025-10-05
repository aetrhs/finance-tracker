const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategorySummary
} = require('../controllers/expenseController');

const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

router.route('/summary')
  .get(protect, getCategorySummary);

module.exports = router;