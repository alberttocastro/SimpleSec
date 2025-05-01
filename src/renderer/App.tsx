import React, { useEffect } from 'react';

function App(): JSX.Element {
  useEffect(() => {
    window.ipcAPI?.rendererReady();
  }, []);

  return (
    <div className="app container mt-5">
      <h4 className="text-primary">Welcome to React, Electron, and TypeScript</h4>
      <p>Hello</p>
    </div>
  );
}

export default App;
