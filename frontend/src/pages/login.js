import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.email, formData.password);
      navigate('/'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='auth-container'>
      <h1 className='text-3xl font-bold mb-6'>Login</h1>
      {error && <p className='error-message p-2 bg-red-100 border border-red-400 text-red-700 rounded mb-4'>{error}</p>}
      <form onSubmit={handleSubmit} className='auth-form bg-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
        <div className='form-control mb-4'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
          <input type='email' name='email' value={formData.email} onChange={handleChange} required className='w-full mt-1 p-2 border border-gray-300 rounded' />
        </div>
        <div className='form-control mb-6'>
          <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
          <input type='password' name='password' value={formData.password} onChange={handleChange} required className='w-full mt-1 p-2 border border-gray-300 rounded' />
        </div>
        <button type='submit' className='w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-150'>Login</button>
      </form>
      <p className='mt-4 text-sm text-gray-600'>
        Don't have an account? <a href='/register' className='text-blue-600 hover:underline'>Register</a>
      </p>
    </div>
  );
};

export default LoginPage;