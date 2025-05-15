// client/src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Navbar: Token found:', storedToken ? 'Present' : 'Null');
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="bg-navbar p-4 fixed w-full top-0 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          SmartSpend
        </Link>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-secondary">
                Dashboard
              </Link>
              <Link to="/dashboard/expenses" className="text-white hover:text-secondary">
                Expenses
              </Link>
              <button onClick={handleLogout} className="text-white hover:text-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-secondary">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;