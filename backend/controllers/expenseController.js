const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res, next) => { 
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.addTransaction = async (req, res, next) => { 
  try {
    const { description, amount, category } = req.body; 

    const transaction = await Transaction.create({ 
      description, 
      amount, 
      category, 
      user: req.user._id
    });

    return res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      console.error('Validation Error Details:', messages);
      return res.status(400).json({ success: false, error: messages });
    } else {
      console.error('Error in addTransaction:', error);
      return res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
};


exports.updateTransaction = async (req, res, next) => { 
  try {
    let transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found or unauthorized' });
    }

    const { description, amount, category, date } = req.body; 

    if (description) transaction.description = description; 
    if (amount !== undefined) transaction.amount = amount;
    if (category) transaction.category = category;
    if (date) transaction.date = date;

    await transaction.save();

    return res.status(200).json({ success: true, data: transaction });

  } catch (error) {
    console.error('Error in updateTransaction:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};


exports.deleteTransaction = async (req, res, next) => { 
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found or unauthorized' });
    }

    await Transaction.deleteOne({ _id: req.params.id });

    return res.status(200).json({ success: true, data: {} });

  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};


exports.getCategorySummary = async (req, res, next) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const summary = await Transaction.aggregate([
      { 
        $match: {
          user: req.user._id,
          amount: { $lt: 0 },
          $expr: {
            $and: [
              { $eq: [{ $year: "$date" }, currentYear] },
              { $eq: [{ $month: "$date" }, currentMonth] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$category",
          totalExpense: { $sum: { $abs: "$amount" } }
        }
      },
      {
        $sort: { totalExpense: -1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error in getCategorySummary:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};