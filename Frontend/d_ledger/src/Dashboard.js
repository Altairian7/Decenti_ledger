import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Dledgerbg from './DLedgerbg.jpg';
import { onAuthStateChanged } from 'firebase/auth'; // Only import onAuthStateChanged
import { auth } from './firebaseConfig'; // Import auth object from firebaseConfig.js

function Dashboard() {
  const [uid, setUid] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the uid from Firebase Authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // Set the uid from the authenticated user
      } else {
        setError("No user UID found. Please login first.");
        navigate('/login'); // Redirect to login if no user is authenticated
      }
    });

    // Cleanup the subscription to the authentication state
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Check for MetaMask and get the wallet address
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setError("No wallet address found. Please connect your wallet.");
            navigate('/metamask'); // Redirect to MetaMask if no wallet is connected
          }
        })
        .catch((error) => {
          console.error('Error fetching wallet address:', error);
          setError("Error fetching wallet address. Please connect your wallet.");
          navigate('/metamask');
        });
    } else {
      setError("MetaMask extension not found. Please install it.");
      navigate('/metamask'); // Redirect if MetaMask is not installed
    }
  }, [navigate]);

  // If both UID and wallet are set, navigate to the Home page
  useEffect(() => {
    if (uid && account) {
      setTimeout(() => {
        navigate('/properties'); // Navigate to Home page after successful login and wallet connection
      }, 3000); // 3-second delay
    }
  }, [uid, account, navigate]);

  const backgroundStyle = {
    backgroundImage: `url(${Dledgerbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  };

  return (
    <div className="App-header" style={backgroundStyle}>
      <div className="dashboard-container">
        <h1>Welcome to Your Dashboard</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {uid && account ? (
          <div className="dashboard-info">
            <h2>User Information</h2>
            <p>UID: {uid}</p>
            <p>Wallet Connected: {account}</p>
          </div>
        ) : (
          <div className="dashboard-info">
            <h2>No Wallet Connected</h2>
            <p>Please connect your wallet to continue.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
