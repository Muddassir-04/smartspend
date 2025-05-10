import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Navbar: Token found:', token);
    setIsAuthenticated(!!token);
  }, [location]); // Re-run on route changes

  const handleLogout = () => {
    console.log('Navbar: Logging out');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav style={{ background: '#333', padding: '1rem', color: 'white' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
        <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
            <li><button onClick={handleLogout} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link></li>
            <li><Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;