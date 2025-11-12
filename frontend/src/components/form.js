import React, { useState } from 'react';
import { addTransaction } from '../api/expenses';

const initialFormState = {
  description: '',
  amount: '',
  category: 'Other',
  date: new Date().toISOString().split('T')[0]
};

const ExpenseForm = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    try {
      const addedExpense = await addTransaction(newExpense);
      onAddTransaction(addedExpense);
      setFormData(initialFormState);
    } catch (err) {
      setError('Failed to add expense. Please check your inputs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-xl p-6 my-8 border border-emerald-100 relative overflow-hidden'>
      {/* Decorative background element */}
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -translate-y-16 translate-x-16 opacity-50'></div>
      
      <div className='relative z-10'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
          </div>
          <h2 className='font-bold text-gray-800 text-2xl'>Add New Transaction</h2>
        </div>
        
        <form onSubmit={handleSubmit} className='space-y-5'>
          {error && (
            <div className='p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center'>
              <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>
              {error}
            </div>
          )}

          <div className='group'>
            <label htmlFor='description' className='block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors'>
              Description / Purpose
            </label>
            <input 
              type='text' 
              name='description' 
              id='description' 
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-gray-50 focus:bg-white'
              value={formData.description} 
              onChange={handleChange} 
              placeholder='What was this transaction for?'
              required 
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='group'>
              <label htmlFor='amount' className='block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors'>
                Amount ($)
              </label>
              <input 
                type='number' 
                name='amount' 
                id='amount' 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-gray-50 focus:bg-white'
                value={formData.amount} 
                onChange={handleChange} 
                placeholder='e.g., -50 or 500' 
                step='0.01' 
                required
              />
              <p className='text-xs text-gray-500 mt-1'>Use negative (-) for expenses, positive for income</p>
            </div>
            
            <div className='group'>
              <label htmlFor='date' className='block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors'>
                Date
              </label>
              <input 
                type='date' 
                name='date' 
                id='date' 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-gray-50 focus:bg-white'
                value={formData.date} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>

          <div className='group'>
            <label htmlFor='category' className='block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors'>
              Category
            </label>
            <select 
              name='category' 
              id='category' 
              value={formData.category} 
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-gray-50 focus:bg-white'
            >
              {['Food', 'Grocery', 'Trinkets', 'Income', 'Drinks', 'Other'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button 
            type='submit' 
            disabled={loading}
            className='w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg'
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                Adding Transaction...
              </div>
            ) : (
              <div className='flex items-center justify-center'>
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                </svg>
                Add Transaction
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;