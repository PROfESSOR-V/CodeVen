import React from 'react';

export default function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#0D1117', 
      color: 'white', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
        🚀 CODEVENGERS Test Page
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#58A6FF' }}>
        React is working! The app is loading successfully.
      </p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#161B22', borderRadius: '8px' }}>
        <p>✅ React Components: Working</p>
        <p>✅ CSS Styling: Working</p>
        <p>✅ JavaScript: Working</p>
      </div>
    </div>
  );
}
