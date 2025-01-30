// frontend/web3Auth.js
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);

export const connectMetaMask = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      return accounts[0]; // Return the user's MetaMask account address
    } catch (error) {
      console.error('User denied account access');
      throw new Error('MetaMask access denied');
    }
  } else {
    throw new Error('Please install MetaMask!');
  }
};

export const signMessage = async (account) => {
  const message = "Please sign this message to authenticate";
  const signature = await web3.eth.personal.sign(message, account, '');
  return { message, signature };
};

export const authenticateWithBackend = async (account, signature, message) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/web3-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        signature,
        account,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Backend authentication failed');
  }
};
