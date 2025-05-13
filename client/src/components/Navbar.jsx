import { useState, useEffect } from 'react';
   import { Link, useNavigate, useLocation } from 'react-router-dom';

   function Navbar() {
     const [token, setToken] = useState(localStorage.getItem('token'));
     const navigate = useNavigate();
     const location = useLocation();

     useEffect(() => {
       const currentToken = localStorage.getItem('token');
       setToken(currentToken);
       console.log(`Navbar: Token found: ${currentToken ? 'Present' : 'Null'}`);
     }, [location.pathname]);

     const handleLogout = () => {
       console.log('Navbar: Logging out');
       localStorage.removeItem('token');
       setToken(null);
       navigate('/login');
     };

     return (
       <nav className="bg-gray-800 text-white fixed w-full top-0 z-10 shadow-md">
         <div className="mx-auto px-4 py-3 flex justify-between items-center">
           <Link
             to="/"
             className="text-2xl font-bold"
             style={{
               fontFamily: "'Poppins', sans-serif",
               background: 'linear-gradient(to right, #60A5FA, #3B82F6)', // Blue gradient
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
             }}
           >
             SmartSpend
           </Link>
           <div className="space-x-4">
             <Link to="/" className="hover:text-blue-300">Home</Link>
             {token ? (
               <>
                 <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
                 <button
                   onClick={handleLogout}
                   className="hover:text-blue-300 focus:outline-none"
                 >
                   Logout
                 </button>
               </>
             ) : (
               <>
                 <Link to="/login" className="hover:text-blue-300">Login</Link>
                 <Link to="/register" className="hover:text-blue-300">Register</Link>
               </>
             )}
           </div>
         </div>
       </nav>
     );
   }

   export default Navbar;