import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Navbar />
      <div className="container mx-auto p-4 mt-16 bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-900">SmartSpend Home</h1>
                <p className="text-gray-900">Welcome to SmartSpend! Please login or register.</p>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;