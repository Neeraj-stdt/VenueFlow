import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

import Login from './pages/Login';
import ClubDashboard from './pages/ClubDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      {/* Global Toaster for sleek notifications across all pages */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b', 
            color: '#fff',
            fontWeight: '600',
            borderRadius: '10px',
          }
        }} 
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/club-dashboard" element={<ClubDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;