import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * Memory Card Game Component
 * A game where players match pairs of cards to test their memory
 * Features include card shuffling, flipping, match detection, scoring, and win condition
 */
const MemoryGame = () => {
  // Emoji sets for different difficulty levels
  const cardSymbolSets = {
    easy: ['🚀', '🎮', '🎯', '🏆', '🎨', '💎'],
    medium: ['🚀', '🎮', '🎯', '🏆', '🎨', '💎', '🎲', '🎭'],
    hard: ['🚀', '🎮', '🎯', '🏆', '🎨', '💎', '🎲', '🎭', '🌟', '🔥']
  };
  
  // Game state management
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [cardSymbols, setCardSymbols] = useState(cardSymbolSets.medium);
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [highScores, setHighScores] = useState({
    easy: { score: 0, moves: 0, time: 0 },
    medium: { score: 0, moves: 0, time: 0 },
    hard: { score: 0, moves: 0, time: 0 }
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Grid config based on difficulty
  const gridConfig = {
    easy: { cols: 3, cardSize: 90 },
    medium: { cols: 4, cardSize: 80 },
    hard: { cols: 5, cardSize: 70 }
  };

  // Initialize and shuffle cards
  const initializeCards = (selectedDifficulty = difficulty) => {
    const symbols = cardSymbolSets[selectedDifficulty];
    
    // Create pairs of cards with the same symbol
    const cardPairs = [...symbols, ...symbols].map((symbol, index) => ({
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
    
    setCardSymbols(symbols);
    setCards(shuffledCards);
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStatus('playing');
    setGameTime(0);
    setIsNewHighScore(false);
  };
  
  // Load high scores from localStorage on component mount
  useEffect(() => {
    const savedHighScores = localStorage.getItem('memoryGameHighScores');
    if (savedHighScores) {
      try {
        setHighScores(JSON.parse(savedHighScores));
      } catch (error) {
        console.error('Error parsing high scores from localStorage:', error);
      }
    }
  }, []);
  
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

  // Initialize cards on component mount or difficulty change
  useEffect(() => {
    initializeCards(difficulty);
  }, [difficulty]);
  
  // Check for win condition every time matched pairs changes
  useEffect(() => {
    if (matchedPairs.length > 0 && matchedPairs.length === cardSymbols.length) {
      const finalScore = calculateScore();
      
      // Check if this is a new high score
      if (
        finalScore > highScores[difficulty].score || 
        (finalScore === highScores[difficulty].score && moves < highScores[difficulty].moves) ||
        (finalScore === highScores[difficulty].score && 
         moves === highScores[difficulty].moves && 
         gameTime < highScores[difficulty].time)
      ) {
        // New high score!
        const newHighScores = {
          ...highScores,
          [difficulty]: {
            score: finalScore,
            moves,
            time: gameTime
          }
        };
        
        setHighScores(newHighScores);
        setIsNewHighScore(true);
        
        // Save to localStorage
        try {
          localStorage.setItem('memoryGameHighScores', JSON.stringify(newHighScores));
        } catch (error) {
          console.error('Error saving high scores to localStorage:', error);
        }
      }
      
      setGameStatus('won');
      setTimerRunning(false);
    }
  }, [matchedPairs, cardSymbols.length, moves, gameTime, difficulty, highScores]);
  
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
    // Make deduction steeper for easy mode and gentler for hard mode
    const deductionFactor = {
      easy: 5,
      medium: 3,
      hard: 2
    };
    
    const deduction = Math.min(70, Math.max(0, (moves - minPossibleMoves) * deductionFactor[difficulty]));
    return Math.max(30, maxScore - deduction);
  };
  
  // Format time from seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Change difficulty level
  const handleDifficultyChange = (newDifficulty) => {
    if (difficulty !== newDifficulty && (gameStatus === 'won' || window.confirm('Changing difficulty will start a new game. Continue?'))) {
      setDifficulty(newDifficulty);
      setGameStarted(false);
      setTimerRunning(false);
    }
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
        <div className="memory-game-difficulty">
          <button 
            className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('easy')}
            aria-label="Easy difficulty"
          >
            Easy
          </button>
          <button 
            className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('medium')}
            aria-label="Medium difficulty"
          >
            Medium
          </button>
          <button 
            className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('hard')}
            aria-label="Hard difficulty"
          >
            Hard
          </button>
        </div>
        
        {gameStatus === 'playing' ? (
          <>
            <div className="memory-game-stats">
              <div className="stat">
                <span className="stat-label">Moves</span>
                <span className="stat-value">{moves}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Matched</span>
                <span className="stat-value">
                  <div className="progress-circle-container">
                    <div className="progress-circle-bg">
                      <div 
                        className="progress-circle-fill" 
                        style={{transform: `rotate(${(matchedPairs.length / cardSymbols.length) * 360}deg)`}}
                      ></div>
                    </div>
                    <div className="progress-circle-text">{matchedPairs.length}/{cardSymbols.length}</div>
                  </div>
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Time</span>
                <span className="stat-value">{formatTime(gameTime)}</span>
              </div>
            </div>
            
            <div 
              className="memory-game-board" 
              style={{ 
                gridTemplateColumns: `repeat(${gridConfig[difficulty].cols}, 1fr)`, 
                maxWidth: `${gridConfig[difficulty].cols * (gridConfig[difficulty].cardSize + 15)}px`
              }}
            >
              {cards.map((card, index) => (
                <div 
                  key={card.id}
                  className={`memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                  onClick={() => handleCardClick(index)}
                  style={{
                    height: `${gridConfig[difficulty].cardSize}px`,
                    width: `${gridConfig[difficulty].cardSize}px`
                  }}
                  role="button"
                  aria-pressed={card.isFlipped}
                  aria-label={`Card ${index + 1}${card.isFlipped ? ', showing ' + card.symbol : ''}`}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(index);
                    }
                  }}
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
            
            <div className="best-score">
              <span>Best Score: {highScores[difficulty].score}</span>
              <span>Best Moves: {highScores[difficulty].moves || 'N/A'}</span>
              <span>Best Time: {highScores[difficulty].time ? formatTime(highScores[difficulty].time) : 'N/A'}</span>
            </div>
          </>
        ) : (
          <div className="memory-game-result">
            <div className="result-icon">🏆</div>
            <h3>Congratulations!</h3>
            <p>You've matched all the cards!</p>
            <div className="celebration-confetti left"></div>
            <div className="celebration-confetti right"></div>
            
            {isNewHighScore && (
              <div className="new-high-score">
                <span>🌟 New High Score! 🌟</span>
              </div>
            )}
            
            <div className="result-stats">
              <div className="result-stat">
                <span>Difficulty:</span>
                <span>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
              </div>
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
            
            <div className="result-actions">
              <button className="btn btn-large" onClick={handleRestartGame}>
                Play Again
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => setDifficulty(difficulty === 'hard' ? 'easy' : 
                              difficulty === 'medium' ? 'hard' : 'medium')}
              >
                Try {difficulty === 'hard' ? 'Easy' : 
                     difficulty === 'medium' ? 'Hard' : 'Medium'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style jsx="true">{`
        .memory-game {
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        
        .memory-game::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-blue), var(--accent-blue));
          border-radius: 4px 4px 0 0;
        }
        
        .memory-game-difficulty {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          background-color: var(--background-light);
          padding: 10px;
          border-radius: 30px;
          box-shadow: 0 2px 6px var(--shadow-color);
        }
        
        .difficulty-btn {
          background: none;
          border: 2px solid transparent;
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .difficulty-btn:hover {
          color: var(--primary-blue);
          background-color: rgba(33, 150, 243, 0.1);
        }
        
        .difficulty-btn.active {
          background-color: var(--primary-blue);
          color: white;
          box-shadow: 0 2px 5px rgba(33, 150, 243, 0.3);
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
          position: relative;
          overflow: hidden;
        }
        
        .memory-game-stats::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: ${(matchedPairs.length / cardSymbols.length) * 100}%;
          height: 4px;
          background-color: var(--primary-blue);
          transition: width 0.3s ease;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5px 15px;
          position: relative;
        }
        
        .stat:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -5px;
          top: 20%;
          height: 60%;
          width: 1px;
          background-color: var(--border-color);
        }
        
        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--primary-blue-dark);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .progress-circle-container {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .progress-circle-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #e0e0e0;
          overflow: hidden;
        }
        
        .progress-circle-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background-color: var(--primary-blue);
          transform-origin: right center;
          transition: transform 0.3s ease;
        }
        
        .progress-circle-text {
          position: relative;
          z-index: 2;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary-blue-dark);
        }
        
        .memory-game-board {
          display: grid;
          grid-gap: 12px;
          margin: 20px 0;
          perspective: 1000px;
          width: 100%;
        }
        
        .memory-card {
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
          box-shadow: 0 4px 8px var(--shadow-color);
          will-change: transform;
        }
        
        @media (max-width: 500px) {
          .memory-card {
            height: 70px !important;
            width: 70px !important;
          }
        }
        
        @media (max-width: 400px) {
          .memory-card {
            height: 60px !important;
            width: 60px !important;
          }
        }
        
        .memory-card:hover {
          transform: translateY(-2px);
        }
        
        .memory-card:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--primary-blue), 0 4px 8px var(--shadow-color);
          transform: translateY(-2px);
        }
        
        .memory-card.flipped {
          transform: rotateY(180deg);
        }
        
        .memory-card.matched {
          box-shadow: 0 0 0 2px var(--success-color);
          animation: pulse 1.5s infinite, matched-celebration 0.5s;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 2px var(--success-color);
          }
          50% {
            box-shadow: 0 0 0 4px var(--success-color);
          }
          100% {
            box-shadow: 0 0 0 2px var(--success-color);
          }
        }
        
        @keyframes matched-celebration {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
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
        }
        
        .memory-card-front {
          background: linear-gradient(135deg, var(--primary-blue-light), white);
          box-shadow: inset 0 0 0 2px var(--primary-blue-light);
        }
        
        .memory-card-front::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.2) 50%, 
            transparent 100%);
          border-radius: 10px;
        }
        
        .memory-card-back {
          transform: rotateY(180deg);
          background: linear-gradient(45deg, var(--primary-blue-light) 0%, #ffffff 100%);
          color: var(--primary-blue-dark);
          box-shadow: inset 0 0 0 2px var(--primary-blue);
        }
        
        .memory-card-symbol {
          font-size: 2rem;
          transition: transform 0.2s ease;
        }
        
        .memory-card:hover .memory-card-symbol {
          transform: scale(1.1);
        }
        
        .memory-game-restart {
          margin-top: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .memory-game-restart:after {
          content: "";
          position: absolute;
          top: -50%;
          left: -60%;
          width: 20px;
          height: 200%;
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(30deg);
          transition: transform 0.6s;
          opacity: 0;
        }
        
        .memory-game-restart:hover:after {
          transform: rotate(30deg) translateX(300px);
          opacity: 1;
        }
        
        .memory-game-restart:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.5);
        }
        
        .best-score {
          margin-top: 20px;
          background-color: var(--background-light);
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          gap: 15px;
          box-shadow: 0 2px 4px var(--shadow-color);
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
          position: relative;
          overflow: hidden;
        }
        
        .memory-game-result::after {
          content: '';
          position: absolute;
          top: -50px;
          left: 0;
          right: 0;
          height: 50px;
          background: 
            radial-gradient(circle, var(--primary-blue) 8px, transparent 8px) 0 0/20px 20px,
            radial-gradient(circle, var(--success-color) 8px, transparent 8px) 10px 10px/20px 20px;
          animation: confetti-fall 3s linear infinite;
          opacity: 0.7;
          z-index: 1;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-50px);
          }
          100% {
            transform: translateY(600px);
          }
        }
        
        .celebration-confetti {
          position: absolute;
          width: 10px;
          height: 30px;
          top: 0;
          z-index: 10;
        }
        
        .celebration-confetti.left {
          left: 30px;
          animation: confetti-diagonal-left 5s ease-in-out infinite;
        }
        
        .celebration-confetti.right {
          right: 30px;
          animation: confetti-diagonal-right 5s ease-in-out infinite;
        }
        
        .celebration-confetti:before {
          content: '🎉';
          position: absolute;
          font-size: 2rem;
        }
        
        @keyframes confetti-diagonal-left {
          0% {
            transform: translate(0, -50px) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-100px, 400px) rotate(-540deg);
            opacity: 0;
          }
        }
        
        @keyframes confetti-diagonal-right {
          0% {
            transform: translate(0, -50px) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(100px, 400px) rotate(540deg);
            opacity: 0;
          }
        }
        
        .memory-game-result::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-blue), var(--success-color));
        }
        
        .result-icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
          background: linear-gradient(135deg, var(--primary-blue-light), white);
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--primary-blue-dark);
          box-shadow: 0 10px 20px rgba(33, 150, 243, 0.2);
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .new-high-score {
          margin: 10px 0;
          padding: 8px 20px;
          background-color: var(--success-color);
          color: white;
          font-weight: 600;
          border-radius: 20px;
          animation: pulse-highlight 1.5s infinite, star-rotate 3s ease-in-out infinite alternate;
          position: relative;
        }
        
        .new-high-score:before,
        .new-high-score:after {
          content: "🌟";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          animation: star-bounce 2s ease infinite;
        }
        
        .new-high-score:before {
          left: -20px;
          animation-delay: 0s;
        }
        
        .new-high-score:after {
          right: -20px;
          animation-delay: 0.5s;
        }
        
        @keyframes star-bounce {
          0%, 100% { transform: translateY(-50%); }
          50% { transform: translateY(-70%); }
        }
        
        @keyframes pulse-highlight {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .result-stats {
          display: flex;
          flex-direction: column;
          margin: 20px 0;
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
        
        .result-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 250px;
        }
        
        .btn-outline {
          background-color: transparent;
          border: 2px solid var(--primary-blue);
          color: var(--primary-blue);
          box-shadow: none;
        }
        
        .btn-outline:hover {
          background-color: rgba(33, 150, 243, 0.1);
          box-shadow: 0 2px 5px rgba(33, 150, 243, 0.2);
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
          .memory-game {
            padding: 20px 15px;
          }
          
          .memory-game-board {
            grid-gap: 10px;
          }
          
          .memory-card-symbol {
            font-size: 1.6rem;
          }
          
          .best-score {
            flex-direction: column;
            gap: 5px;
            align-items: center;
          }
        }
        
        @media (max-width: 480px) {
          .memory-game-stats {
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            padding: 10px;
          }
          
          .memory-game-difficulty {
            flex-wrap: wrap;
            padding: 5px;
          }
          
          .memory-card-symbol {
            font-size: 1.4rem;
          }
          
          .difficulty-btn {
            font-size: 0.8rem;
            padding: 5px 10px;
            margin: 2px;
          }
          
          .best-score {
            font-size: 0.75rem;
            flex-direction: column;
            text-align: center;
            padding: 8px 15px;
          }
          
          .game-title {
            font-size: 1.5rem;
            margin-bottom: 10px;
          }
          
          .game-description {
            font-size: 0.9rem;
            margin-bottom: 15px;
          }
          
          .stat-value {
            font-size: 1.2rem;
          }
          
          .stat-label {
            font-size: 0.75rem;
          }
        }
        
        /* Extra small devices */
        @media (max-width: 360px) {
          .memory-card {
            height: 50px !important;
            width: 50px !important;
          }
          
          .memory-card-symbol {
            font-size: 1.2rem;
          }
          
          .memory-game-board {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default MemoryGame;
