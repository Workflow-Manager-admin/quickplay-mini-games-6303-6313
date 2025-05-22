import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainContainer from './components/MainContainer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="logo">
                <span className="logo-symbol">🎮</span> QuickPlay Mini Games
              </div>
            </div>
          </div>
        </nav>

        <main>
          <div className="container">
            <MainContainer />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
