import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import Map from './Map';
import Navbar from './NavBar';
import { auth } from './firebaseConfig';


function Home() {
  const [account, setAccount] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Rendering Home Component...");

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.warn("User not authenticated, redirecting...");
        navigate('/Login'); // Redirect to login page if user is not authenticated
      }
    });

    // MetaMask: Check if MetaMask is installed and connect wallet
    const handleMetaMaskConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            console.log("MetaMask Connected:", accounts[0]);
            setAccount(accounts[0]);
          } else {
            console.warn("MetaMask: No accounts found.");
            navigate('/metamask');
          }
        } catch (error) {
          console.error('MetaMask Error:', error);
          navigate('/metamask');
        }
      } else {
        console.warn("MetaMask not installed.");
        navigate('/metamask');
      }
    };

    handleMetaMaskConnection();

    // Fetch properties from the backend
    const fetchProperties = async () => {
      try {
        const userUid = auth.currentUser?.uid; // Assuming user_uid is the Firebase UID
        console.log("Fetching Properties for User UID:", userUid);

        const response = await fetch(`http://192.168.137.1:5000/api/papers/papers/?user_uid=${userUid}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Properties:", data);
          setProperties(data);
        } else {
          console.error("API Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchProperties();

    return () => unsubscribe();
  }, [navigate]);

  const handleCityClick = (city) => {
    console.log("City Clicked:", city);
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Fixed background image */}
      <div
        className="fixed-background"
        style={{
          backgroundImage: `url('/homehouse.jpg')`,
        }}
      ></div>
      <Navbar />
      <main className="main-content">
        <div className="content-container">
          <h2 className="page-title">Welcome to DLedger</h2>
          {properties.length === 0 ? (
            <p>Loading properties...</p>
          ) : (
            <Map onCityClick={handleCityClick} estates={properties} />
          )}

          {/* Modal for city information */}
          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-button" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
                <h3>City Information</h3>
                <p>
                  <strong>Name:</strong> {selectedCity?.name}
                </p>
                <p>
                  <strong>Description:</strong> {selectedCity?.description}
                </p>

              </div>

            </div>

          )}
        </div>
      </main>
    </div>
  );
}

export default Home;