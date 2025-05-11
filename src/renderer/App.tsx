import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Persons from './persons/Persons';
import PersonDetail from './persons/PersonDetail';

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
    <div className="app container">
      <Routes>
        <Route path="/" element={<Persons />} />
        <Route path="/persons" element={<Persons />} />
        <Route path="/persons/:id" element={<PersonDetail />} />
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
