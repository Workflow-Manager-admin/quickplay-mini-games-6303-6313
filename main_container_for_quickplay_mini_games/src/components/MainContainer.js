import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import MemoryGame from '../games/MemoryGame';
import QuizGame from '../games/QuizGame';
import TicTacToe from '../games/TicTacToe';

// PUBLIC_INTERFACE
/**
 * MainContainer for QuickPlay Mini Games
 * Serves as the primary container for organizing and navigating between mini-games
 */
const MainContainer = () => {
  const [activeGame, setActiveGame] = useState(null);
  const navigate = useNavigate();
  
  // List of available games
  const games = [
    { id: 'memory', name: 'Memory Game', path: '/memory' },
    { id: 'quiz', name: 'Quiz Game', path: '/quiz' },
    { id: 'tictactoe', name: 'Tic-Tac-Toe', path: '/tictactoe' }
  ];
  
  // Game selection handler
  const handleGameSelection = (gameId) => {
    setActiveGame(gameId);
  };
  
  // Home page with game selection cards
  const GameSelection = () => (
    <div className="game-content">
      <h1 className="game-title">QuickPlay Mini Games</h1>
      <p className="game-description">
        Choose a mini-game below to start playing. Perfect for a quick gaming break!
      </p>
      
      <div className="game-cards">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card" 
            onClick={() => navigate(game.path)}
          >
            <div className="game-card-icon">
              {game.id === 'memory' && '🃏'}
              {game.id === 'quiz' && '❓'}
              {game.id === 'tictactoe' && '⭕'}
            </div>
            <h3 className="game-card-title">{game.name}</h3>
            <p className="game-card-description">
              {game.id === 'memory' && 'Test your memory by matching pairs of cards.'}
              {game.id === 'quiz' && 'Challenge your knowledge with fun quiz questions.'}
              {game.id === 'tictactoe' && 'The classic game of X and O. Play against a friend.'}
            </p>
            <button className="btn game-card-button">Play Now</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="games-container">
      {/* Navigation Menu */}
      <div className="game-menu">
        <NavLink 
          to="/" 
          className={({isActive}) => 
            isActive ? 'game-menu-item active' : 'game-menu-item'
          }
          end
        >
          Home
        </NavLink>
        
        {games.map((game) => (
          <NavLink 
            key={game.id}
            to={game.path} 
            className={({isActive}) => 
              isActive ? 'game-menu-item active' : 'game-menu-item'
            }
          >
            {game.name}
          </NavLink>
        ))}
      </div>
      
      {/* Routes for Different Games */}
      <Routes>
        <Route path="/" element={<GameSelection />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/quiz" element={<QuizGame />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
      </Routes>
    </div>
  );
};

export default MainContainer;
