import React, { useState, useEffect, useCallback } from 'react';
import TransactionForm from '../components/form';
import TransactionItem from '../components/items';
import Chart from '../components/chart';
import { getTransactions, deleteTransaction, updateTransaction } from '../api/expenses';
import { useAuth } from '../context/AuthContext';

const Main = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setDataLoading(true);
    try {
      // 🚨 API call now requires the JWT token handled by the API service
      const data = await getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      // Set a generic error message if fetching fails (e.g., due to expired token)
      setError('Could not fetch transactions. Please ensure you are logged in.');
      setTransactions([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    // 👈 NEW: Only fetch transactions if the user is authenticated
    if (isAuthenticated) {
      fetchTransactions();
    } else if (!authLoading) {
      // Clear data if not authenticated and not currently loading auth state
      setTransactions([]);
      setDataLoading(false);
    }
  }, [isAuthenticated, authLoading, fetchTransactions]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(prevTransactions => prevTransactions.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete transaction.');
      console.error(err);
    }
  };

  const handleUpdateTransaction = async (id, updateData) => {
    try {
      const updatedTransaction = await updateTransaction(id, updateData);

      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction._id === id ? updatedTransaction : transaction
        )
      );
    } catch (err) {
      setError('Failed to update transaction.');
      console.error(err);
    }
  };

  const amounts = transactions.map(t => t.amount);
  const totalBalance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) * -1)
    .toFixed(2);

  if (authLoading) {
    return <div className='text-center mt-10 text-xl'>Loading User Session...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col items-center justify-center h-full w-full p-8'>

        <div className='text-center mt-40'>
          <h1 className='text-3xl font-bold text-gray-800'>Welcome to Your Tracker</h1>
          <p className='mt-4 text-lg text-gray-600'>Please <a href='/login' className='text-blue-600 font-semibold underline'>Login</a> or <a href='/register' 
          className='text-green-600 font-semibold underline'>Register</a> to view your transactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-gradient-to-b from-[#FAF8F1] to-[#FAEAB1]'>
      <div className='flex mx-auto justify-center lg:max-w-[1440px]'>
        <div className='flex flex-col h-full w-full'>
          <div className='mt-16 px-5'>
            <h1 className='text-2xl font-bold mb-4'>Balance: ${totalBalance}</h1>
            <div className='flex justify-between p-4 bg-white rounded-lg shadow'>
              <div className='text-center'>
                <h4 className='text-green-500 font-semibold'>Income</h4>
                <p className='text-lg'>+${income}</p>
              </div>
              <div className='text-center border-l border-gray-200 pl-4'>
                <h4 className='text-red-500 font-semibold'>Expense</h4>
                <p className='text-lg'>-${expense}</p>
              </div>
            </div>
          </div>

          <div className="justify-end mt-8">
            <Chart transactions={transactions} />
          </div>

          <div className='mt-8 px-5'>
            <h3 className='font-bold text-xl mb-3'>Your Transactions</h3>
            {dataLoading && <p>Loading transactions...</p>}
            {error && <p className='error-message p-2 bg-red-100 text-red-700 rounded'>{error}</p>}
            <div className='grid grid-cols-5 font-bold text-gray-700 border-b-2 border-gray-300 bg-gray-100 py-2 px-4 sticky top-0 z-10'>
              <span>Description</span>
              <span>Category</span>
              <span>Amount</span>
              <span>Date</span>
              <span className='justify-self-center'>Actions</span>
            </div>

            <ul className='list space-y-2'>
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <TransactionItem
                    key={transaction._id}
                    expense={transaction}
                    onDelete={handleDeleteTransaction}
                    onUpdate={handleUpdateTransaction}
                  />
                ))
              ) : (
                !dataLoading && !error && 
                <p className='text-center px-4 py-2 mb-10 border border-b-2 border-solid border-gray-300 border-t-0 border-l-0 border-r-0'>No transactions found!</p>
              )}
            </ul>
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;