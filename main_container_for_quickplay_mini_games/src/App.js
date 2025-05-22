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
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div className="logo">
                <span className="logo-symbol">🎮</span> QuickPlay Mini Games
              </div>
              <div className="nav-links">
                <a href="#" className="nav-link">Games</a>
                <a href="#" className="nav-link">Leaderboard</a>
                <a href="#" className="nav-link">About</a>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <div className="container">
            <MainContainer />
          </div>
        </main>
        
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <span className="logo-symbol">🎮</span> QuickPlay Mini Games
              </div>
              <div className="footer-links">
                <div className="footer-section">
                  <h4>Quick Links</h4>
                  <a href="#" className="footer-link">Home</a>
                  <a href="#" className="footer-link">Games</a>
                  <a href="#" className="footer-link">Leaderboard</a>
                </div>
                <div className="footer-section">
                  <h4>Social</h4>
                  <div className="social-icons">
                    <a href="#" className="social-icon">📱</a>
                    <a href="#" className="social-icon">💻</a>
                    <a href="#" className="social-icon">📧</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} QuickPlay Mini Games. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
