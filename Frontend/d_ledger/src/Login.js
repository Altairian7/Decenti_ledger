import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { firebaseApp } from './firebaseConfig';
import Dledgerbg from './DLedgerbg.jpg';
import ModelViewer from './ModelViewer';

function Login() {
  const [currentView, setCurrentView] = useState('signin'); // Track the current authentication view

  const switchView = (view) => {
    setCurrentView(view);
  };

  const backgroundStyle = {
    backgroundImage: `url(${Dledgerbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  };

  return (
    <div className="App-header" style={backgroundStyle}>
      <div className="auth-container">
        <h1>Welcome to D-Ledger</h1>
        {currentView === 'signin' && <SignIn switchView={switchView} />}
        {currentView === 'signup' && <SignUp switchView={switchView} />}
        {currentView === 'forgot-password' && <ForgotPassword switchView={switchView} />}
      </div>
      <div style={{ width: '50%', height: '100%' }}>
        <ModelViewer />
      </div>
    </div>
  );
}

function SignIn({ switchView }) {
  const auth = getAuth(firebaseApp);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid; // Get user UID
      localStorage.setItem('uid', uid); // Store UID in local storage or use a context/state for better management
      navigate('/metamask'); // Navigate without passing UID in URL
    } catch (error) {
      alert(`Sign In Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSignIn}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don’t have an account? <span onClick={() => switchView('signup')}>Sign Up</span>
      </p>
      <p>
        Forgot your password? <span onClick={() => switchView('forgot-password')}>Reset it</span>
      </p>
    </div>
  );
}

function SignUp({ switchView }) {
  const auth = getAuth(firebaseApp);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid; // Get user UID
      localStorage.setItem('uid', uid); // Store UID in local storage or use a context/state for better management
      navigate('/metamask'); // Navigate without passing UID in URL
    } catch (error) {
      alert(`Sign Up Error: ${error.message}`);
    }
  };

  const buttonStyle = {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#3a855d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSignUp}>
        <input type="text" name="fullName" placeholder="Full Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" style={buttonStyle}>Sign Up</button>
      </form>
      <p>
        Already have an account? <span onClick={() => switchView('signin')}>Sign In</span>
      </p>
    </div>
  );
}

function ForgotPassword({ switchView }) {
  const auth = getAuth(firebaseApp);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Reset link sent to your email!');
      switchView('signin'); // Redirect to sign-in after reset
    } catch (error) {
      alert(`Password Reset Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleForgotPassword}>
        <input type="email" name="email" placeholder="Enter your email" required />
        <button type="submit">Send Reset Link</button>
      </form>
      <p>
        Remembered your password? <span onClick={() => switchView('signin')}>Sign In</span>
      </p>
    </div>
  );
}

export default Login;
