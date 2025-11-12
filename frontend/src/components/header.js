import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className='bg-[#82968c] text-white p-4 shadow-md flex justify-between items-center'>
      <a href='/' className='lg:text-2xl font-bold tracking-wider'>Overview</a>
      <nav>
        {isAuthenticated ? (
          <div className='flex items-center space-x-4'>
            <span className='text-lg'>Welcome, {user?.username || 'User'}!</span>
            <button onClick={logout} className='bg-[#c9eddc] px-3 py-1 rounded text-md font-medium transition duration-150 text-gray-600'>
              Logout
            </button>
          </div>
        ) : (
          <div className='space-x-4'>
            <a href='/login' className='hover:text-gray-300'>Login</a>
            <a href='/register' className='bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition duration-150'>Register</a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;