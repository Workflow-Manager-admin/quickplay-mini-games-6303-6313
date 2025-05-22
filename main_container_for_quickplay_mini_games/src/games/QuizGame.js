import React, { useState } from 'react';

// PUBLIC_INTERFACE
/**
 * Quiz Game Component
 * A game where players answer trivia questions from various categories
 */
const QuizGame = () => {
  // Quiz questions data
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
      correctAnswer: "Blue Whale"
    },
    {
      question: "Who wrote the play 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare"
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: "Au"
    }
  ];

  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // Current question being displayed
  const currentQuestion = questions[currentQuestionIndex];

  // Handler for option selection
  const handleOptionSelect = (option) => {
    if (answered) return; // Prevent changing answer after submission
    
    setSelectedOption(option);
  };

  // Handler for submitting the answer
  const handleSubmitAnswer = () => {
    if (!selectedOption || answered) return;

    // Check if the answer is correct
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Save the user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = {
      question: currentQuestion.question,
      selectedOption,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    };
    setUserAnswers(newUserAnswers);
    setAnswered(true);
  };

  // Handler for moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  // Handler for restarting the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setUserAnswers([]);
  };

  // Render option with appropriate styling based on selection and correctness
  const renderOption = (option, index) => {
    let optionClass = "quiz-option";
    
    if (answered) {
      if (option === currentQuestion.correctAnswer) {
        optionClass += " correct";
      } else if (option === selectedOption) {
        optionClass += " incorrect";
      }
    } else if (option === selectedOption) {
      optionClass += " selected";
    }

    return (
      <div 
        key={index} 
        className={optionClass}
        onClick={() => handleOptionSelect(option)}
      >
        {option}
      </div>
    );
  };

  // Results view showing final score and answers
  const renderResults = () => {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="quiz-results">
        <h3>Quiz Completed!</h3>
        <div className="quiz-score">
          <p>Your Score: <span>{score} / {questions.length}</span></p>
          <div className="score-percentage">
            <div 
              className="score-bar" 
              style={{width: `${percentage}%`, backgroundColor: getScoreColor(percentage)}}
            ></div>
          </div>
          <p className="score-text" style={{color: getScoreColor(percentage)}}>
            {percentage}%
          </p>
        </div>
        
        <div className="quiz-answers-review">
          <h4>Your Answers:</h4>
          {userAnswers.map((answer, index) => (
            <div key={index} className="answer-item">
              <p className="answer-question">Q{index + 1}: {answer.question}</p>
              <p>
                Your answer: <span className={answer.isCorrect ? "correct-text" : "incorrect-text"}>
                  {answer.selectedOption}
                </span>
              </p>
              {!answer.isCorrect && (
                <p>Correct answer: <span className="correct-text">{answer.correctAnswer}</span></p>
              )}
            </div>
          ))}
        </div>
        
        <button className="btn quiz-button" onClick={handleRestartQuiz}>
          Play Again
        </button>
      </div>
    );
  };

  // Helper function to get color based on score percentage
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'var(--success-color)';
    if (percentage >= 50) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  // Quiz progress indicator
  const renderProgress = () => {
    return (
      <div className="quiz-progress">
        <div className="progress-text">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{width: `${((currentQuestionIndex) / questions.length) * 100}%`}}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-content">
      <h2 className="game-title">Quiz Game</h2>
      <p className="game-description">
        Test your knowledge with fun trivia questions across various categories.
        Answer correctly to earn points and beat your high score!
      </p>
      
      <div className="mini-game-container quiz-container">
        {!showResult ? (
          <div className="quiz-game">
            {renderProgress()}
            
            <div className="quiz-question">
              <h3>{currentQuestion.question}</h3>
            </div>
            
            <div className="quiz-options">
              {currentQuestion.options.map((option, index) => renderOption(option, index))}
            </div>
            
            <div className="quiz-actions">
              {!answered ? (
                <button 
                  className="btn quiz-button" 
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption}
                >
                  Submit Answer
                </button>
              ) : (
                <button className="btn quiz-button" onClick={handleNextQuestion}>
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </div>
            
            {answered && (
              <div className={`answer-feedback ${selectedOption === currentQuestion.correctAnswer ? 'correct-feedback' : 'incorrect-feedback'}`}>
                {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'} 
                {selectedOption !== currentQuestion.correctAnswer && (
                  <p>The correct answer is {currentQuestion.correctAnswer}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          renderResults()
        )}
      </div>
      
      <style jsx="true">{`
        .quiz-container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 30px;
        }
        
        .quiz-game, .quiz-results {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .quiz-progress {
          margin-bottom: 20px;
        }
        
        .progress-text {
          text-align: right;
          font-size: 0.9rem;
          margin-bottom: 5px;
          color: var(--text-secondary);
        }
        
        .progress-bar-container {
          width: 100%;
          height: 6px;
          background-color: var(--kavia-dark-accent);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background-color: var(--kavia-orange);
          transition: width 0.3s ease;
        }
        
        .quiz-question {
          margin-bottom: 20px;
          text-align: center;
        }
        
        .quiz-question h3 {
          font-size: 1.4rem;
          margin-bottom: 20px;
        }
        
        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .quiz-option {
          padding: 15px;
          background-color: var(--kavia-dark-accent);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }
        
        .quiz-option:hover {
          background-color: rgba(232, 122, 65, 0.2);
        }
        
        .quiz-option.selected {
          border-color: var(--kavia-orange);
          background-color: rgba(232, 122, 65, 0.2);
        }
        
        .quiz-option.correct {
          border-color: var(--success-color);
          background-color: rgba(76, 175, 80, 0.2);
        }
        
        .quiz-option.incorrect {
          border-color: var(--error-color);
          background-color: rgba(244, 67, 54, 0.2);
        }
        
        .quiz-actions {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        .quiz-button {
          min-width: 150px;
        }
        
        .quiz-button:disabled {
          background-color: #888;
          cursor: not-allowed;
        }
        
        .answer-feedback {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
          animation: fadeIn 0.5s ease;
        }
        
        .correct-feedback {
          background-color: rgba(76, 175, 80, 0.2);
          color: var(--success-color);
        }
        
        .incorrect-feedback {
          background-color: rgba(244, 67, 54, 0.2);
          color: var(--error-color);
        }
        
        .quiz-score {
          text-align: center;
          margin: 20px 0;
        }
        
        .quiz-score p {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }
        
        .quiz-score span {
          font-weight: 600;
        }
        
        .score-percentage {
          width: 100%;
          height: 10px;
          background-color: var(--kavia-dark-accent);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 5px;
        }
        
        .score-bar {
          height: 100%;
          transition: width 1s ease;
        }
        
        .score-text {
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .quiz-answers-review {
          margin-top: 30px;
          margin-bottom: 30px;
        }
        
        .answer-item {
          margin-bottom: 15px;
          padding: 15px;
          background-color: var(--kavia-dark-accent);
          border-radius: 8px;
        }
        
        .answer-question {
          font-weight: 500;
          margin-bottom: 10px;
        }
        
        .correct-text {
          color: var(--success-color);
        }
        
        .incorrect-text {
          color: var(--error-color);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .quiz-container {
            padding: 15px;
          }
          
          .quiz-question h3 {
            font-size: 1.2rem;
          }
          
          .quiz-option {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizGame;
