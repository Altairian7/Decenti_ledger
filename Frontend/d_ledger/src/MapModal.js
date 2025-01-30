import React, { useState } from 'react';
import Map from './Map';
import './MapModal.css';

const MapModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <button className="open-modal-button" onClick={toggleModal}>
        Open Map
      </button>
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}  // Prevents overlay from closing
          >
            <button className="close-modal-button" onClick={toggleModal}>
              &times;
            </button>
            <Map onCityClick={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapModal;
