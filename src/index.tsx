// filepath: /C:/Users/alber/SimpleSec/src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const App = () => {
  return <h1 className="text-3xl font-bold underline">Hello, React with Electron and Tailwind CSS!</h1>;
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);