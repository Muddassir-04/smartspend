import { useState, useEffect } from 'react';
   import axios from 'axios';

   function Dashboard() {
     const [user, setUser] = useState(null);
     const [error, setError] = useState('');

     useEffect(() => {
       const fetchUser = async () => {
         try {
           const token = localStorage.getItem('token');
           const response = await axios.get('http://localhost:5000/api/profile', {
             headers: { Authorization: `Bearer ${token}` },
           });
           setUser(response.data);
         } catch (err) {
           setError('Failed to fetch user data');
           console.error(err);
         }
       };
       fetchUser();
     }, []);

     return (
       <div className="container mx-auto mt-16 p-4 bg-gray-50">
         <h1 className="text-2xl font-bold mb-4 text-gray-900">Dashboard</h1>
         {error && <p className="text-red-500">{error}</p>}
         {user ? (
           <p className="text-gray-900">Welcome to SmartSpend, {user.email}!</p>
         ) : (
           <p className="text-gray-900">Loading...</p>
         )}
       </div>
     );
   }

   export default Dashboard;