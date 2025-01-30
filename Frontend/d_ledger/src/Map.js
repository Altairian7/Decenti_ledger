import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { auth } from './firebaseConfig';  // Make sure this import points to your Firebase config
import { onAuthStateChanged } from 'firebase/auth';
import './Map.css';

const Map = ({ onPropertySelect }) => {
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const polygonsRef = useRef([]);

  // Handle Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(currentUser ? true : false); // Only show loading if we have a user
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Fetch estates data
  useEffect(() => {
    const fetchEstates = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://192.168.137.1:5000/api/papers/papers/?user_uid=${user.uid}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch estates data');
        }

        const data = await response.json();
        console.log('Fetched estates:', data);
        setEstates(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching estates:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEstates();
    }
  }, [user]); // Depend on user state

  // Initialize and update map
  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      const defaultCenter = [28.574885, 77.241475];
      mapInstance.current = L.map(mapRef.current).setView(defaultCenter, 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);
    }

    // Clear existing polygons
    polygonsRef.current.forEach(polygon => {
      if (mapInstance.current) {
        polygon.remove();
      }
    });
    polygonsRef.current = [];

    // Add markers for each estate
    if (mapInstance.current && estates && estates.length > 0) {
      const bounds = L.latLngBounds([]);

      estates.forEach((estate) => {
        if (estate.coordinates && Array.isArray(estate.coordinates)) {
          try {
            const polygon = L.polygon(estate.coordinates, {
              color: '#4CAF50',
              fillColor: '#81C784',
              fillOpacity: 0.5,
              weight: 2
            }).addTo(mapInstance.current);

            polygonsRef.current.push(polygon);
            bounds.extend(polygon.getBounds());

            const formatDate = (dateString) => {
              return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            };

            const popupContent = `
              <div class="estate-popup">
                <h3>${estate.title || 'Untitled Property'}</h3>
                <p><strong>Size:</strong> ${estate.land_size || 'N/A'} sqft</p>
                <p><strong>City:</strong> ${estate.city || 'N/A'}</p>
                <p><strong>IPFS Hash:</strong> ${estate.ipfs_hash || 'N/A'}</p>
                <p><strong>Created At:</strong> ${formatDate(estate.created_at)}</p>
                <p><strong>Updated At:</strong> ${formatDate(estate.updated_at)}</p>
                <p><strong>Status:</strong> ${estate.status || 'N/A'}</p>
                <p><strong>Owner ID:</strong> ${estate.owner_id || 'N/A'}</p>
                <p><strong>Description:</strong> ${estate.description || 'No description available'}</p>
                <p><strong>Coordinates:</strong> ${JSON.stringify(estate.coordinates)}</p>
              </div>
            `;
            
            polygon.bindPopup(popupContent, {
              maxWidth: 300,
              maxHeight: 400,
              autoPan: true,
              closeButton: true,
              autoPanPadding: [50, 50]
            });

            polygon.on('click', () => {
              polygon.openPopup();
              if (onPropertySelect) {
                onPropertySelect(estate);
              }
            });

          } catch (error) {
            console.error('Error creating polygon for estate:', error);
            console.log('Problematic coordinates:', estate.coordinates);
          }
        }
      });

      if (bounds.isValid()) {
        mapInstance.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 18
        });
      }
    }

    return () => {
      polygonsRef.current.forEach(polygon => {
        if (polygon) polygon.remove();
      });
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [estates, onPropertySelect]);

  if (!user) {
    return (
      <div className="map-error" style={{ padding: '20px', textAlign: 'center' }}>
        Please sign in to view the map
      </div>
    );
  }

  if (loading) {
    return (
      <div className="map-loading" style={{ padding: '20px', textAlign: 'center' }}>
        Loading map data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-error" style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="map-container" 
      style={{ 
        height: '600px', 
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }} 
    />
  );
};

export default Map;