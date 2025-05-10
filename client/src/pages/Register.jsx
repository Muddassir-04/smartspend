import { useState } from 'react';
     import axios from 'axios';
     import { useNavigate } from 'react-router-dom';

     const Register = () => {
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');
       const [message, setMessage] = useState('');
       const navigate = useNavigate();

       const handleSubmit = async (e) => {
         e.preventDefault();
         const payload = { email, password };
         console.log('Submitting:', payload);
         try {
           const response = await axios.post('http://localhost:5000/api/register', payload);
           console.log('API Response:', response.data);
           setMessage(response.data.message);
           localStorage.setItem('token', response.data.token); // Store JWT
           navigate('/dashboard'); // Redirect to dashboard
         } catch (error) {
           console.error('Register error:', error.response?.data);
           setMessage(error.response?.data.message || 'Registration failed');
         }
       };

       return (
         <div>
           <h2>Register</h2>
           <form onSubmit={handleSubmit}>
             <div>
               <label>Email:</label>
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div>
               <label>Password:</label>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
             <button type="submit">Register</button>
           </form>
           {message && <p>{message}</p>}
         </div>
       );
     };

     export default Register;