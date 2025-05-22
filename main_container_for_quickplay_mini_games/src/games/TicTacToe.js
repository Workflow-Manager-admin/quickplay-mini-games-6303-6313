import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * Tic-Tac-Toe Game Component
 * The classic game of X and O played on a 3x3 grid
 */
const TicTacToe = () => {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // X starts the game
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, draw
  const [winner, setWinner] = useState(null);
  
  // Game statistics for the session
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0
  });

  // Winning combinations (indexes)
  const winningCombinations = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  // Check for a winner or draw
  useEffect(() => {
    const checkGameStatus = () => {
      // Check for winner
      for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          setGameStatus('won');
          setWinner(board[a]);
          setScores(prevScores => ({
            ...prevScores,
            [board[a]]: prevScores[board[a]] + 1
          }));
          return;
        }
      }
      
      // Check for draw
      if (!board.includes(null)) {
        setGameStatus('draw');
        setScores(prevScores => ({
          ...prevScores,
          draws: prevScores.draws + 1
        }));
        return;
      }
    };
    
    checkGameStatus();
  }, [board]);
  
  // Handle click on a square
  const handleSquareClick = (index) => {
    // Do nothing if square is filled or game is over
    if (board[index] || gameStatus !== 'playing') {
      return;
    }
    
    // Update board with new move
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };
  
  // Restart the game
  const handleRestartGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus('playing');
    setWinner(null);
  };
  
  // Reset scores and game
  const handleResetScores = () => {
    setScores({
      X: 0,
      O: 0,
      draws: 0
    });
    handleRestartGame();
  };
  
  // Render a square
  const renderSquare = (index) => {
    return (
      <button 
        className={`square ${board[index] ? 'filled' : ''} ${winner && winningCombinations.some(combo => combo.includes(index) && combo.every(i => board[i] === board[index])) ? 'winning' : ''}`}
        onClick={() => handleSquareClick(index)}
      >
        {board[index]}
      </button>
    );
  };
  
  // Render game status message
  const renderStatus = () => {
    if (gameStatus === 'won') {
      return <div className="game-status winner">{winner} wins!</div>;
    } else if (gameStatus === 'draw') {
      return <div className="game-status draw">It's a draw!</div>;
    } else {
      return <div className="game-status">Next player: {xIsNext ? 'X' : 'O'}</div>;
    }
  };
  
  return (
    <div className="game-content">
      <h2 className="game-title">Tic-Tac-Toe</h2>
      <p className="game-description">
        The classic game of X and O. Take turns marking spaces on a 3x3 grid.
        The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins!
      </p>
      
      <div className="mini-game-container tictactoe-container">
        <div className="game-scores">
          <div className={`score x-score ${!xIsNext && gameStatus === 'playing' ? 'active' : ''}`}>
            <span className="player">Player X</span>
            <span className="score-value">{scores.X}</span>
          </div>
          <div className="score draw-score">
            <span className="player">Draws</span>
            <span className="score-value">{scores.draws}</span>
          </div>
          <div className={`score o-score ${xIsNext && gameStatus === 'playing' ? 'active' : ''}`}>
            <span className="player">Player O</span>
            <span className="score-value">{scores.O}</span>
          </div>
        </div>
        
        {renderStatus()}
        
        <div className="game-board">
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
        
        <div className="game-controls">
          <button className="btn" onClick={handleRestartGame}>New Game</button>
          <button className="btn reset-btn" onClick={handleResetScores}>Reset Scores</button>
        </div>
      </div>
      
      <style jsx="true">{`
        .tictactoe-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
        }
        
        .game-scores {
          display: flex;
          justify-content: space-around;
          width: 100%;
          max-width: 350px;
          margin-bottom: 25px;
          background-color: var(--background-light);
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }
        
        .score {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 15px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .score.active {
          background-color: var(--primary-blue-light);
          box-shadow: 0 2px 6px var(--shadow-color);
          transform: translateY(-3px);
        }
        
        .player {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 5px;
        }
        
        .score-value {
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .x-score .score-value {
          color: var(--primary-blue-dark);
        }
        
        .o-score .score-value {
          color: var(--error-color);
        }
        
        .draw-score .score-value {
          color: var(--warning-color);
        }
        
        .game-status {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 20px;
          padding: 10px 20px;
          border-radius: 8px;
          background-color: var(--background-light);
          color: var(--text-color);
          box-shadow: 0 2px 4px var(--shadow-color);
          animation: fadeIn 0.3s ease;
        }
        
        .game-status.winner {
          background-color: var(--primary-blue-light);
          color: var(--primary-blue-dark);
          font-weight: 600;
        }
        
        .game-status.draw {
          background-color: var(--warning-color);
          color: white;
          font-weight: 600;
        }
        
        .game-board {
          display: grid;
          grid-gap: 8px;
          background-color: var(--primary-blue);
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 4px 12px var(--shadow-color);
          margin-bottom: 30px;
        }
        
        .board-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 8px;
        }
        
        .square {
          width: 80px;
          height: 80px;
          background-color: var(--background-light);
          border: none;
          border-radius: 8px;
          font-size: 2rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--primary-blue-dark);
          position: relative;
          overflow: hidden;
        }
        
        .square:hover {
          background-color: white;
          box-shadow: 0 2px 6px var(--shadow-color);
          transform: translateY(-2px);
        }
        
        .square.filled {
          cursor: not-allowed;
        }
        
        .square.filled:hover {
          transform: none;
        }
        
        .square:focus {
          outline: none;
          box-shadow: 0 0 0 2px var(--primary-blue-dark);
        }
        
        .square.winning {
          background-color: var(--primary-blue-light);
          color: var(--primary-blue-dark);
          animation: pulse 1s infinite;
        }
        
        .square:nth-child(odd):not(.filled):not(:hover) {
          background-color: rgba(187, 222, 251, 0.3);
        }
        
        .game-controls {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }
        
        .reset-btn {
          background-color: var(--text-secondary);
        }
        
        .reset-btn:hover {
          background-color: var(--text-color);
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .tictactoe-container {
            padding: 15px;
          }
          
          .game-scores {
            width: 100%;
            padding: 10px;
          }
          
          .score {
            padding: 8px 10px;
          }
          
          .player {
            font-size: 0.8rem;
          }
          
          .score-value {
            font-size: 1.2rem;
          }
          
          .square {
            width: 70px;
            height: 70px;
            font-size: 1.7rem;
          }
          
          .game-status {
            font-size: 1.1rem;
            padding: 8px 15px;
          }
          
          .game-controls {
            flex-direction: column;
            width: 100%;
            max-width: 250px;
          }
        }
        
        @media (max-width: 480px) {
          .square {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }
          
          .game-scores {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default TicTacToe;
