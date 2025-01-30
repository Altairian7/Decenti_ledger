import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="copyright">
          © {currentYear} DLedger. All rights reserved.
        </div>
        <div className="contact">
          Contact us: <a href="mailto:admin@hadnt.com">admin@hadnt.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;