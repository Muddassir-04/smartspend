import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
     import Register from './pages/Register';
     import Login from './pages/Login';
     import Dashboard from './pages/Dashboard';

     function App() {
       return (
         <Router>
           <div>
             <Routes>
               <Route path="/register" element={<Register />} />
               <Route path="/login" element={<Login />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/" element={<h1>SmartSpend Home</h1>} />
             </Routes>
           </div>
         </Router>
       );
     }

     export default App;