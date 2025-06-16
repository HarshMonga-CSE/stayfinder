import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import HostDashboard from './pages/HostDashboard';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;