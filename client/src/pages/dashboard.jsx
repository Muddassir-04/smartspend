import { useState, useEffect } from 'react';
     import axios from 'axios';

     const Dashboard = () => {
       const [email, setEmail] = useState('');
       const [error, setError] = useState('');

       useEffect(() => {
         const fetchProfile = async () => {
           try {
             const token = localStorage.getItem('token');
             if (!token) {
               setError('Please log in to view your profile');
               return;
             }
             const response = await axios.get('http://localhost:5000/api/profile', {
               headers: { Authorization: `Bearer ${token}` },
             });
             setEmail(response.data.email);
           } catch (error) {
             console.error('Profile fetch error:', error.response?.data);
             setError(error.response?.data.message || 'Failed to load profile');
           }
         };
         fetchProfile();
       }, []);

       return (
         <div>
           <h2>Dashboard</h2>
           {email ? (
             <p>Welcome to SmartSpend, {email}!</p>
           ) : (
             <p>Loading profile...</p>
           )}
           {error && <p style={{ color: 'red' }}>{error}</p>}
         </div>
       );
     };

     export default Dashboard;