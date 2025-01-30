import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MetaMask from './MetaMask';
import Dashboard from './Dashboard';
import Home from './Home';
import Myproperties from './properties';
import Settings from './settings';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/metamask" element={<MetaMask />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/properties" element={<Myproperties />}/>
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </Router>
  );
}

export default App;
