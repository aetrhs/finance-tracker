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
    <div className='w-full min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pb-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Financial Dashboard</h1>
          <p className='text-gray-600'>Track your income and expenses with ease</p>
        </div>

        {/* Balance Overview Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {/* Total Balance Card */}
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -translate-y-10 translate-x-10 opacity-50'></div>
            <div className='relative z-10'>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Total Balance</h3>
                <div className='w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                  </svg>
                </div>
              </div>
              <p className={`text-3xl font-bold ${
                parseFloat(totalBalance) >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                ${totalBalance}
              </p>
            </div>
          </div>

          {/* Income Card */}
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-green-100 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -translate-y-10 translate-x-10 opacity-50'></div>
            <div className='relative z-10'>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Total Income</h3>
                <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 11l5-5m0 0l5 5m-5-5v12' />
                  </svg>
                </div>
              </div>
              <p className='text-3xl font-bold text-green-600'>+${income}</p>
            </div>
          </div>

          {/* Expenses Card */}
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-red-100 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50'></div>
            <div className='relative z-10'>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Total Expenses</h3>
                <div className='w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 13l-5 5m0 0l-5-5m5 5V6' />
                  </svg>
                </div>
              </div>
              <p className='text-3xl font-bold text-red-600'>-${expense}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Add Transaction Form */}
          <div className='lg:col-span-1'>
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>

          {/* Right Column - Transactions and Chart */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Chart Section */}
            <div className='bg-white rounded-2xl shadow-xl p-6 border border-emerald-100'>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Spending Overview</h3>
              <Chart transactions={transactions} />
            </div>

            {/* Transactions Section */}
            <div className='bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden'>
              <div className='p-6 border-b border-gray-200'>
                <h3 className='text-xl font-bold text-gray-900'>Recent Transactions</h3>
                <p className='text-gray-600 text-sm mt-1'>Manage your income and expenses</p>
              </div>
              
              <div className='p-6'>
                {dataLoading && (
                  <div className='text-center py-8'>
                    <div className='inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-emerald-500 bg-emerald-100'>
                      <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Loading transactions...
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className='p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center mb-4'>
                    <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                    </svg>
                    {error}
                  </div>
                )}

                {transactions.length > 0 ? (
                  <ul className='space-y-3'>
                    {transactions.map(transaction => (
                      <TransactionItem
                        key={transaction._id}
                        expense={transaction}
                        onDelete={handleDeleteTransaction}
                        onUpdate={handleUpdateTransaction}
                      />
                    ))}
                  </ul>
                ) : (
                  !dataLoading && !error && (
                    <div className='text-center py-12'>
                      <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                      </svg>
                      <h3 className='mt-2 text-sm font-medium text-gray-900'>No transactions</h3>
                      <p className='mt-1 text-sm text-gray-500'>Get started by adding your first transaction.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;