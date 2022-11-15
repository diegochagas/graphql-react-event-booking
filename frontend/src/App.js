import React, { useState } from 'react'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'

import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context'

import './App.css';

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  const login = (tokenParam, userIdParam, tokenExpiration) => {
    setToken(tokenParam)
    setUserId(userIdParam)
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, login, logout }}>
        <MainNavigation />

        <main className="main-content">
          <Routes>
            <Route path="/events" element={<EventsPage />} />
            {!token && (
              <>
                <Route path="/bookings" element={<Navigate replace to="/auth" />} />
                <Route path="/" element={<Navigate replace to="/auth" />} />
                <Route path="/auth" element={<AuthPage />} />
              </>
            )}
            {token && (
              <>
                <Route path="/" element={<Navigate replace to="/events" />} />
                <Route path="/auth" element={<Navigate replace to="/events" />} />
                <Route path="/bookings" element={<BookingsPage />} />
              </>
            )}
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
