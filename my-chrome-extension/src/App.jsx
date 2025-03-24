import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');

  const handleAnalyze = () => {
    console.log("Analyze button clicked!");
    chrome.runtime.sendMessage(
      { action: 'startAnalysis' }, // No specific text needed, as sentences are extracted by the content script
      (response) => {
        if (response) {
          console.log("Response from content script:", response.message || response.error);
          alert(`Response: ${response.message || response.error}`);
        } else {
          console.error("No response received from content script.");
        }
      }
    );
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Email Phishing Checker</h1>
      <div className="card">
        <button onClick={handleAnalyze}>Analyze Page</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;