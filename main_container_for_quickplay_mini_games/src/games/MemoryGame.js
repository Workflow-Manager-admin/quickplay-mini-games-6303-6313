import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * Memory Card Game Component
 * A game where players match pairs of cards to test their memory
 * Features include card shuffling, flipping, match detection, scoring, and win condition
 */
const MemoryGame = () => {
  // Card data with emojis as images (pairs are created in the initializeCards function)
  const cardSymbols = ['🚀', '🎮', '🎯', '🏆', '🎨', '💎', '🎲', '🎭'];
  
  // Game state management
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Initialize and shuffle cards
  const initializeCards = () => {
    // Create pairs of cards with the same symbol
    const cardPairs = [...cardSymbols, ...cardSymbols].map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle the cards using Fisher-Yates algorithm
    const shuffledCards = [...cardPairs];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    
    setCards(shuffledCards);
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStatus('playing');
    setGameTime(0);
  };
  
  // Start the game timer when first card is flipped
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setGameTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Initialize cards on component mount
  useEffect(() => {
    initializeCards();
  }, []);
  
  // Check for win condition every time matched pairs changes
  useEffect(() => {
    if (matchedPairs.length > 0 && matchedPairs.length === cardSymbols.length) {
      setGameStatus('won');
      setTimerRunning(false);
    }
  }, [matchedPairs, cardSymbols.length]);
  
  // Handle card flip logic
  const handleCardClick = (index) => {
    // Start timer on first card flip
    if (!gameStarted) {
      setGameStarted(true);
      setTimerRunning(true);
    }
    
    // Don't allow flipping if:
    // - Card is already flipped or matched
    // - Already two cards are flipped
    // - Game is won
    if (
      cards[index].isFlipped || 
      cards[index].isMatched ||
      flippedIndexes.length >= 2 ||
      gameStatus === 'won'
    ) {
      return;
    }
    
    // Flip the card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    // Add this card to flipped indexes
    const newFlippedIndexes = [...flippedIndexes, index];
    setFlippedIndexes(newFlippedIndexes);
    
    // If this is the second card flipped
    if (newFlippedIndexes.length === 2) {
      // Increase moves counter
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndexes;
      
      // Check if the cards match
      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setCards(updatedCards);
          setMatchedPairs([...matchedPairs, cards[firstIndex].symbol]);
          setFlippedIndexes([]);
        }, 500);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[firstIndex].isFlipped = false;
          updatedCards[secondIndex].isFlipped = false;
          setCards(updatedCards);
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };
  
  // Calculate score based on moves and pairs found
  const calculateScore = () => {
    // Perfect score is 100, deduct points for extra moves
    const minPossibleMoves = cardSymbols.length; // Best case: find each pair immediately
    const maxScore = 100;
    
    // For every move above the minimum, deduct some points
    const deduction = Math.min(70, Math.max(0, (moves - minPossibleMoves) * 3));
    return Math.max(30, maxScore - deduction);
  };
  
  // Format time from seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Restart game handler
  const handleRestartGame = () => {
    initializeCards();
    setGameStarted(false);
    setTimerRunning(false);
    setGameTime(0);
  };
  
  return (
    <div className="game-content">
      <h2 className="game-title">Memory Card Game</h2>
      <p className="game-description">
        Test your memory by finding matching pairs of cards. 
        The fewer attempts you make, the higher your score!
      </p>
      
      <div className="mini-game-container memory-game">
        {gameStatus === 'playing' ? (
          <>
            <div className="memory-game-stats">
              <div className="stat">
                <span className="stat-label">Moves:</span>
                <span className="stat-value">{moves}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Matched:</span>
                <span className="stat-value">{matchedPairs.length} / {cardSymbols.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Time:</span>
                <span className="stat-value">{formatTime(gameTime)}</span>
              </div>
            </div>
            
            <div className="memory-game-board">
              {cards.map((card, index) => (
                <div 
                  key={card.id}
                  className={`memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="memory-card-inner">
                    <div className="memory-card-front">
                      <span className="memory-card-symbol">?</span>
                    </div>
                    <div className="memory-card-back">
                      <span className="memory-card-symbol">{card.symbol}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn memory-game-restart" onClick={handleRestartGame}>
              Restart Game
            </button>
          </>
        ) : (
          <div className="memory-game-result">
            <div className="result-icon">🏆</div>
            <h3>Congratulations!</h3>
            <p>You've matched all the cards!</p>
            
            <div className="result-stats">
              <div className="result-stat">
                <span>Moves:</span>
                <span>{moves}</span>
              </div>
              <div className="result-stat">
                <span>Time:</span>
                <span>{formatTime(gameTime)}</span>
              </div>
              <div className="result-stat score">
                <span>Score:</span>
                <span>{calculateScore()}/100</span>
              </div>
            </div>
            
            <button className="btn btn-large" onClick={handleRestartGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <style jsx="true">{`
        .memory-game {
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .memory-game-stats {
          display: flex;
          justify-content: space-around;
          width: 100%;
          max-width: 500px;
          margin-bottom: 20px;
          padding: 15px;
          background-color: var(--background-light);
          border-radius: 12px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5px 15px;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 5px;
        }
        
        .stat-value {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--primary-blue-dark);
        }
        
        .memory-game-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 15px;
          margin: 20px 0;
          perspective: 1000px;
          max-width: 500px;
          width: 100%;
        }
        
        .memory-card {
          height: 100px;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
          box-shadow: 0 4px 8px var(--shadow-color);
        }
        
        @media (max-width: 500px) {
          .memory-card {
            height: 80px;
          }
        }
        
        .memory-card.flipped {
          transform: rotateY(180deg);
        }
        
        .memory-card.matched {
          box-shadow: 0 0 0 2px var(--success-color);
          opacity: 0.8;
        }
        
        .memory-card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        
        .memory-card-front,
        .memory-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--primary-blue-light);
          background-color: white;
        }
        
        .memory-card-back {
          transform: rotateY(180deg);
          background-color: var(--primary-blue-light);
          color: var(--primary-blue-dark);
        }
        
        .memory-card-symbol {
          font-size: 2rem;
        }
        
        .memory-game-restart {
          margin-top: 20px;
        }
        
        .memory-game-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 30px;
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px var(--shadow-color);
          animation: pop-in 0.5s cubic-bezier(0.26, 1.32, 0.42, 0.9);
        }
        
        .result-icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
          background-color: var(--primary-blue-light);
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--primary-blue-dark);
        }
        
        .result-stats {
          display: flex;
          flex-direction: column;
          margin: 20px 0 30px;
          width: 100%;
          max-width: 300px;
          background-color: var(--background-light);
          padding: 20px;
          border-radius: 12px;
        }
        
        .result-stat {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-color);
          font-size: 1rem;
        }
        
        .result-stat:last-child {
          border-bottom: none;
        }
        
        .result-stat.score {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--primary-blue-dark);
          margin-top: 10px;
        }
        
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @media (max-width: 768px) {
          .memory-game-board {
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 10px;
          }
          
          .memory-card {
            height: 70px;
          }
          
          .memory-card-symbol {
            font-size: 1.6rem;
          }
        }
        
        @media (max-width: 480px) {
          .memory-game-stats {
            flex-wrap: wrap;
          }
          
          .memory-card {
            height: 60px;
          }
          
          .memory-card-symbol {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MemoryGame;
