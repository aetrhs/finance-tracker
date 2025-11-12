import React, { useState } from 'react';

const CATEGORIES = ['Food', 'Grocery', 'Trinkets', 'Income', 'Drinks', 'Other'];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// to format the date to be shown back when u click edit
const formatInputDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const ExpenseItem = ({ expense, onDelete, onUpdate }) => {
  const isExpense = expense.amount < 0;
  const sign = isExpense ? '-' : '+';
  const formattedDate = formatDate(expense.date);

  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(expense.amount);
  const [newCategory, setNewCategory] = useState(expense.category);
  const [newDescription, setNewDescription] = useState(expense.description);
  const [newDate, setNewDate] = useState(formatInputDate(expense.date));

  const updateDetails = () => {
    onUpdate(expense._id, {
      amount: parseFloat(newAmount),
      category: newCategory,
      description: newDescription,
      date: newDate
    });
    setIsEditing(false);
  };



  return (
    <li className='bg-white rounded-xl shadow-md border border-gray-100 mb-3 overflow-hidden hover:shadow-lg transition-shadow duration-200'>
      {isEditing ? (
        <div className='p-4 bg-gradient-to-r from-emerald-50 to-teal-50'>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-3'>
            <input 
              type='text' 
              value={newDescription} 
              onChange={(e) => setNewDescription(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200'
              placeholder='Description'
            />
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)} 
              className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200'
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input 
              type='number' 
              value={newAmount} 
              step='0.01' 
              onChange={(e) => setNewAmount(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200'
              placeholder='Amount'
            />
            <input 
              type='date' 
              value={newDate} 
              onChange={(e) => setNewDate(e.target.value)} 
              className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200'
            />
            <div className='flex gap-2'>
              <button 
                onClick={updateDetails} 
                className='flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-200 text-sm font-medium'
              >
                Save
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                className='flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition duration-200 text-sm font-medium'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='p-4'>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-3 items-center'>
            <div className='font-medium text-gray-900'>{expense.description}</div>
            <div className='flex items-center'>
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                {expense.category}
              </span>
            </div>
            <div className={`font-bold text-lg ${
              isExpense ? 'text-red-600' : 'text-green-600'
            }`}>
              {sign}${Math.abs(expense.amount).toFixed(2)}
            </div>
            <div className='text-gray-500 text-sm'>{formattedDate}</div>
            <div className='flex gap-2 justify-end'>
              <button 
                onClick={() => setIsEditing(true)} 
                className='inline-flex items-center px-3 py-1.5 border border-emerald-300 text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition duration-200 text-sm font-medium'
              >
                <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                </svg>
                Edit
              </button>
              <button 
                onClick={() => onDelete(expense._id)} 
                className='inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition duration-200 text-sm font-medium'
              >
                <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default ExpenseItem;