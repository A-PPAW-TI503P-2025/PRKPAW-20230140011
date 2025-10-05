import React, { useState } from 'react';

function App() {
  const [nama, setNama] = useState('');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Hello, {nama || 'User'}!</h1>
      <input 
        type="text"
        placeholder="Masukkan nama kamu"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
    </div>
  );
}

export default App;
