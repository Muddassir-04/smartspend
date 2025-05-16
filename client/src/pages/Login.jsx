import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    console.log('Login form submitted', { email: trimmedEmail, password: trimmedPassword });
    try {
      const response = await axios.post('https://smartspend-backend-l8my.onrender.com/api/login', { email: trimmedEmail, password: trimmedPassword });
      console.log('Login successful', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-textMain">Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-textMain">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-textMain">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            onClick={() => console.log('Login button clicked')}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;