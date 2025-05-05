import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Persons from './components/Persons';

function About(): JSX.Element {
  return <h4 className="text-primary">About Page</h4>;
}

function App(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    window.ipcAPI?.rendererReady();
    if (window.location.hash === '#/') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="app container mt-5">
      <nav className="mb-4">
        <Link to="/" className="me-3">Publishers</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Persons />} />
        <Route path="/persons" element={<Persons />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper(): JSX.Element {
  return (
    <Router>
      <App />
    </Router>
  );
}
