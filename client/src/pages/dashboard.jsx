import { useState, useEffect } from 'react';
   import { useNavigate } from 'react-router-dom';
   import axios from 'axios';

   function Dashboard() {
     const [email, setEmail] = useState('');
     const navigate = useNavigate();

     useEffect(() => {
       const token = localStorage.getItem('token');
       if (!token) {
         navigate('/login');
         return;
       }

       const fetchUser = async () => {
         try {
           const response = await axios.get('http://localhost:5000/api/user', {
             headers: { Authorization: `Bearer ${token}` },
           });
           setEmail(response.data.email);
         } catch (err) {
           console.error(err);
           localStorage.removeItem('token');
           navigate('/login');
         }
       };

       fetchUser();
     }, [navigate]);

     return (
       <div className="container mx-auto p-4 bg-background">
         <h1 className="text-3xl font-bold mb-4 text-textMain">
           Welcome to SmartSpend, {email}!
         </h1>
         <p className="text-textMain">This is your dashboard.</p>
       </div>
     );
   }

   export default Dashboard;