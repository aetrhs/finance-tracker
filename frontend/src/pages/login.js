import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen w-full'>
      {/* Left Side - Image */}
      <div className='lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-emerald-100 to-teal-100'>
        <div className='max-w-md text-center'>
          <img 
            src='finance-graphic.png' 
            alt='Finance Login Graphic' 
            className='w-full h-auto mb-6 drop-shadow-lg'
          />
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Track Your Expenses</h2>
          <p className='text-gray-600'>Take control of your financial future with our platform.</p>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className='lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'>
          <div className='w-full max-w-md'>
            <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
              <div className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back!</h1>
                <p className='text-gray-500'>Sign in to continue to your account</p>
              </div>
              
              {error && (
                <div className='mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'>
                  <div className='flex items-center'>
                    <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <input 
                    type='email' 
                    name='email' 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-gray-50 focus:bg-white'
                    placeholder='Enter your email'
                  />
                </div>
                
                <div>
                  <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
                    Password
                  </label>
                  <input 
                    type='password' 
                    name='password' 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-gray-50 focus:bg-white'
                    placeholder='Enter your password'
                  />
                </div>
                
                <button 
                  type='submit' 
                  disabled={isLoading}
                  className='w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  {isLoading ? (
                    <div className='flex items-center justify-center'>
                      <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
              
              <div className='mt-8 text-center'>
                <p className='text-gray-600'>
                  Don't have an account?{' '}
                  <a href='/register' className='font-semibold text-emerald-600 hover:text-emerald-700 transition duration-200'>
                    Create Account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default LoginPage;