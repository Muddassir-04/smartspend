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
       try {
         const response = await axios.post('http://localhost:5000/api/login', { email, password });
         localStorage.setItem('token', response.data.token);
         navigate('/dashboard');
       } catch (err) {
         setError('Login failed');
         console.error(err);
       }
     };

     return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
         <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Login</h2>
           {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
           <form onSubmit={handleSubmit}>
             <div className="mb-4">
               <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                 Email
               </label>
               <input
                 type="email"
                 id="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 required
               />
             </div>
             <div className="mb-4">
               <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                 Password
               </label>
               <input
                 type="password"
                 id="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 required
               />
             </div>
             <button
               type="submit"
               className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
             >
               Login
             </button>
           </form>
         </div>
       </div>
     );
   }

   export default Login;