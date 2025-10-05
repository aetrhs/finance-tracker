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
    <li className={isExpense ? 'expense-item minus' : 'expense-item plus'}>
      {isEditing ? (
        <>
          <div className='grid grid-rows-1 grid-cols-5 gap-2 p-3'>
            <input type='text' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className='col-span-1'>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input type='number' value={newAmount} step='0.01' onChange={(e) => setNewAmount(e.target.value)} />
            <input type='date' value={newDate} onChange={(e) => setNewDate(e.target.value)} className='col-span-1' />
            <button onClick={updateDetails} className='button'>Save</button>
          </div>
        </>
      ) : (
        <>
          <div className='grid px-4'>
            <div className='grid grid-rows-1 grid-cols-5 gap-2'>
              <span className='description'>{expense.description}</span>
              <span className='category'>{expense.category}</span>
              <span className='amount'>
                {sign}${Math.abs(expense.amount).toFixed(2)}
              </span>
              <span className='date'>{formattedDate}</span>
              <div className='flex flex-row gap-3 justify-center'>
                <button onClick={() => setIsEditing(true)} className='button'>Edit</button>
                <button onClick={() => onDelete(expense._id)} className='button'>Delete</button>
              </div>
            </div>
          </div>

        </>
      )}
    </li>
  );
};

export default ExpenseItem;