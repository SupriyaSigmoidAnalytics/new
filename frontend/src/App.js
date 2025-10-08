import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>🚀 Full Stack React + Node App</h1>
      <h2>{message ? message : 'Loading message from backend...'}</h2>
    </div>
  );
}

export default App;
