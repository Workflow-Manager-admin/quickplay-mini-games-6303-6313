import React, { useState, useEffect } from 'react';
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
  
  // Initialize games with vote counts from localStorage or default to 0
  const initialGames = () => {
    const defaultGames = [
      { id: 'memory', name: 'Memory Game', path: '/memory', votes: 0 },
      { id: 'quiz', name: 'Quiz Game', path: '/quiz', votes: 0 },
      { id: 'tictactoe', name: 'Tic-Tac-Toe', path: '/tictactoe', votes: 0 }
    ];
    
    try {
      const savedGames = localStorage.getItem('quickPlayGames');
      return savedGames ? JSON.parse(savedGames) : defaultGames;
    } catch (error) {
      console.error('Error loading games from localStorage:', error);
      return defaultGames;
    }
  };
  
  const [games, setGames] = useState(initialGames);
  
  // Save games to localStorage whenever votes change
  useEffect(() => {
    try {
      localStorage.setItem('quickPlayGames', JSON.stringify(games));
    } catch (error) {
      console.error('Error saving games to localStorage:', error);
    }
  }, [games]);
  
  // Game selection handler
  const handleGameSelection = (gameId) => {
    setActiveGame(gameId);
  };
  
  // Handle voting for a game
  const handleVote = (e, gameId) => {
    e.stopPropagation(); // Prevent the card click event from firing
    
    const updatedGames = games.map(game => 
      game.id === gameId ? { ...game, votes: game.votes + 1 } : game
    );
    
    // Sort games by vote count (highest first)
    const sortedGames = [...updatedGames].sort((a, b) => b.votes - a.votes);
    
    setGames(sortedGames);
  };
  
  // Home page with game selection cards
  const GameSelection = () => (
    <div className="game-content">
      <h1 className="game-title">QuickPlay Mini Games</h1>
      <p className="game-description">
        Choose a mini-game below to start playing. Perfect for a quick gaming break!
        Vote for your favorites to see them at the top of the list!
      </p>
      
      <div className="game-cards">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card" 
            onClick={() => navigate(game.path)}
          >
            <div className="vote-counter">
              <span>{game.votes}</span>
              <button 
                className="vote-button"
                onClick={(e) => handleVote(e, game.id)}
                aria-label={`Vote for ${game.name}`}
              >
                👍
              </button>
            </div>
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
      
      <style jsx="true">{`
        .vote-counter {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          background-color: var(--primary-blue-light);
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 600;
          color: var(--primary-blue-dark);
          z-index: 1;
          box-shadow: 0 2px 4px var(--shadow-color);
          transition: all 0.2s ease;
        }
        
        .vote-counter span {
          margin-right: 8px;
          font-size: 0.9rem;
        }
        
        .vote-button {
          background-color: var(--primary-blue);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: white;
          transition: all 0.2s ease;
          padding: 0;
        }
        
        .vote-button:hover {
          background-color: var(--primary-blue-dark);
          transform: scale(1.1);
        }
        
        .vote-button:active {
          transform: scale(0.95);
        }
      `}</style>
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
