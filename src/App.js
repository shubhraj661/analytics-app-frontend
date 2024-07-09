import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import User from './User';
import RedirectPage from './Redirect';
import Analytics from './Analytics';

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user/:userId" element={<User />} />
        <Route path="/analytics/:qrId" element={<Analytics/>} />
        {/* Add a catch-all route or a 404 page */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
