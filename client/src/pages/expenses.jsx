// client/src/pages/Expenses.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        console.log('Fetching expenses with token:', token);
        const response = await axios.get('https://smartspend-backend-l8my.onrender.com/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Expenses fetched:', response.data);
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError(error.response?.data?.message || 'Failed to fetch expenses');
      }
    };
    if (token) {
      console.log('Token present, fetching expenses...');
      fetchExpenses();
    } else {
      console.log('No token found, cannot fetch expenses');
      setError('Please log in to view expenses');
    }
  }, []); // Removed [token] dependency to prevent re-fetching loops

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding expense with token:', token);
      await axios.post(
        'https://smartspend-backend-l8my.onrender.com/api/expenses',
        { amount, category, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmount('');
      setCategory('');
      setDescription('');
      setError('');
      // Refresh expenses
      const response = await axios.get('https://smartspend-backend-l8my.onrender.com/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Expenses refreshed after adding:', response.data);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error.response?.data?.message || 'Failed to add expense');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-textMain">Track Your Expenses</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-textMain">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-textMain">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-textMain">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-primary text-white rounded">
          Add Expense
        </button>
      </form>
      <h3 className="text-xl font-bold mb-4 text-textMain">Your Expenses</h3>
      {expenses.length === 0 ? (
        <p className="text-textMain">No expenses yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td className="border p-2">{expense.amount}</td>
                <td className="border p-2">{expense.category}</td>
                <td className="border p-2">{expense.description || '-'}</td>
                <td className="border p-2">{new Date(expense.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Expenses;