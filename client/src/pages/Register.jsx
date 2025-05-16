// client/src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    console.log('Register form submitted', { email: trimmedEmail, password: trimmedPassword });
    try {
      const response = await axios.post('https://smartspend-backend-l8my.onrender.com/api/register', {
        email: trimmedEmail,
        password: trimmedPassword,
      });
      console.log('Registration successful', response.data);
      navigate('/login');
    } catch (error) {
      console.error('AxiosError', error);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-textMain">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-textMain">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-textMain">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-primary text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;