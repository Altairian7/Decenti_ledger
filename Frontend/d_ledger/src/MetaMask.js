import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig'; // Import Firestore instance
import './MetaMask.css'; // Import your previous UI styles
import Dledgerbg from './DLedgerbg.jpg'; // Background image
import ModelViewer from './ModelViewer'; // Model viewer component

function MetaMask() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user ? user.uid : null;

  // Check if MetaMask is installed
  const checkIfMetaMaskIsInstalled = () => {
    if (typeof window.ethereum === 'undefined') {
      setError("MetaMask is not installed. Please install it to continue.");
    }
  };

  // Check wallet connection and handle linking
  const checkWalletAndLink = async () => {
    if (!uid) {
      setError("User not authenticated. Please log in.");
      navigate('/login');
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      setError("MetaMask is not installed.");
      return;
    }

    try {
      // Request connected wallet accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const currentWallet = accounts[0];
      const walletDoc = doc(db, 'wallets', uid);
      const walletSnapshot = await getDoc(walletDoc);

      if (walletSnapshot.exists()) {
        const existingWallet = walletSnapshot.data().walletAddress;

        if (existingWallet === currentWallet) {
          // Wallet address matches the one already linked
          setAccount(currentWallet);
          setIsConnected(true);
          setTimeout(() => navigate('/dashboard'), 3000);
        } else {
          // A different wallet is trying to connect
          setError(
            `This UID is already linked to another wallet. Please connect the same wallet.`
          );
        }
      } else {
        // No wallet is linked yet, so link the current wallet
        await setDoc(walletDoc, { walletAddress: currentWallet });
        setAccount(currentWallet);
        setIsConnected(true);
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    } catch (err) {
      setError(`Error checking or uploading wallet address: ${err.message}`);
    }
  };

  useEffect(() => {
    checkIfMetaMaskIsInstalled();
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${Dledgerbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  };

  return (
    <div className="App-header" style={backgroundStyle}>
      <div className="auth-container">
        <h1>Connect with MetaMask</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!isConnected ? (
          <div className="auth-form">
            <h2>Connect to Your Wallet</h2>
            <button onClick={checkWalletAndLink}>Connect MetaMask</button>
          </div>
        ) : (
          <div className="auth-form">
            <h2>Wallet Connected</h2>
            <p>Account: {account}</p>
          </div>
        )}
      </div>
      <div style={{ width: '50%', height: '100%' }}>
        <ModelViewer />
      </div>
    </div>
  );
}

export default MetaMask;
