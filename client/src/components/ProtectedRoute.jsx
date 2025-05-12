import { Navigate } from 'react-router-dom';

     const ProtectedRoute = ({ children }) => {
       const token = localStorage.getItem('token');
       console.log('ProtectedRoute: Token found:', token ? 'Present' : 'Null');
       return token ? children : <Navigate to="/login" replace />;
     };

     export default ProtectedRoute;