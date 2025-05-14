// App.js
import React, { useEffect, useState } from 'react';
import userVerification from 'user-verification';
import './App.css';

function App() {
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    // Initialize the verification SDK
    window.devInit('01JSDXTE94AKXHHVDVCPZDSJAX'); // Replace with your actual site ID
    
    // Set up event listener for verification results
    const handleVerification = (event) => {
      if (event.detail.verified) {
        setStatus({
          message: 'Verification successful!',
          type: 'success'
        });
        console.log('Signature:', event.detail.signature);
      } else {
        setStatus({
          message: 'Verification failed.',
          type: 'error'
        });
      }
    };
    
    document.addEventListener('dev-otp-verified', handleVerification);
    console.log('Verification SDK initialized!');
    
    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('dev-otp-verified', handleVerification);
    };
  }, []);

  return (
    <div className="App">
      <h1>User Verification Demo</h1>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          data-devotp="email" 
          placeholder="Enter your email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input 
          type="tel" 
          id="phone" 
          data-devotp="phone" 
          placeholder="Enter your phone number"
        />
      </div>

      {status.message && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default App;