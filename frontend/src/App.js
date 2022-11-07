import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'

import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
