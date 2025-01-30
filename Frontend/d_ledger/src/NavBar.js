import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            console.warn('No accounts found');
            navigate('/metamask');
          }
        } catch (error) {
          console.error('Error fetching wallet address:', error);
          navigate('/metamask');
        }
      } else {
        console.warn('MetaMask not installed');
        navigate('/metamask');
      }
    };

    // Connect wallet on component mount
    connectWallet();

    // Listen for account changes
    const handleAccountChange = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };

    // Subscribe to account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
    }

    // Cleanup listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    };
  }, [navigate]);

  const handleSignOut = () => {
  
    setAccount(null);

    console.log('Logged out from Firebase');

    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <img
          src="https://images-ext-1.discordapp.net/external/ChzEmOoMFtOPy6JM0CQ10ZyXVhIJIS-dFGGXw4wcShQ/https/i.ibb.co/GQksxNc/logoledger.png?format=webp&quality=lossless&width=472&height=472"
          alt="DLedger Logo"
          className="nav-logo-image"
        />
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/properties">My Properties</Link>
          <Link to="/settings">Settings</Link>
          <div className="wallet-address">
            {account ? (
              <span title={account}>
                {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </span>
            ) : (
              'No Wallet Connected'
            )}
          </div>
          {account && (
            <button className="sign-out-link" onClick={handleSignOut}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
