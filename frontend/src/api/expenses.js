import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

// get token from localstorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};


export const getTransactions = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};


export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(API_URL, transactionData, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};


export const deleteTransaction = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};


export const updateTransaction = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updateData, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const getCategorySummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/summary`, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Error fetching category summary:', error);
    throw error;
  }
};