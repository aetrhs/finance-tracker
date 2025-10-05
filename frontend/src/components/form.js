import React, { useState } from 'react';
import { addTransaction } from '../api/expenses';

const initialFormState = {
  description: '',
  amount: '',
  category: 'Other'
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
    <div className='flex flex-col gap-3 bg-white p-4 rounded-xl shadow my-10'>
      <h2 className='font-bold text-gray-800 text-xl'>Add new transaction :</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        {error && <p className='text-red-600'>{error}</p>}

        <div className='flex flex-col pt-2 pb-1 pl-4 bg-white border border-solid border-neutral040 rounded-lg focus-within:border-blue-400 [&>label]:focus-within:text-blue-400'>
          <label htmlFor='description' className='text-gray-400 text-md font-[600]'>Description / Purpose</label>
          <input type='text' name='description' id='description' className='h-8 w-full text-[16px] focus:outline-none'
            value={formData.description} onChange={handleChange} required />
        </div>

        <div className='flex flex-row justify-center gap-3'>
          <div className='w-1/2 flex flex-col pt-2 pb-1 pl-4 bg-white border border-solid border-neutral040 rounded-lg focus-within:border-blue-400 [&>label]:focus-within:text-blue-400'>
            <label htmlFor='amount' className='text-gray-400 text-md font-[600]'>Amount ($)</label>
            <input type='number' name='amount' className='h-8 w-full placeholder-neutral050 text-[16px] focus:outline-none'
              id='amount' value={formData.amount} onChange={handleChange} placeholder='Enter amount (e.g., -50 or 500)' step='0.01' required/>
          </div>
          <div className='w-1/2 flex flex-col pt-2 pb-1 pl-4 bg-white border border-solid border-neutral040 rounded-lg focus-within:border-blue-400 [&>label]:focus-within:text-blue-400'>
            <label htmlFor='date' className='text-gray-400 text-md font-[600]'>Date</label>
            <input type='date' name='date' className='h-8 w-full text-[16px] focus:outline-none'
              id='date' value={formData.date} onChange={handleChange} step='0.01' required/>
          </div>
        </div>

        <div className='flex flex-col pt-2 pb-1 pl-4 bg-white border border-solid border-neutral040 rounded-lg focus-within:border-blue-400 [&>label]:focus-within:text-blue-400'>
          <label htmlFor='category' className='text-gray-400 text-md font-[600]'>Category</label>
          <select name='category' id='category' value={formData.category} onChange={handleChange}
            className='h-8 w-full text-[16px] bg-none focus:outline-none'>
            {['Food', 'Grocery', 'Trinkets', 'Income', 'Drinks', 'Other'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button type='submit' disabled={loading} className='w-fit px-3 py-2 rounded-xl bg-gray-500 text-white hover:text-black hover:bg-gray-200'>
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;