import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import { checkWinner, getBestMove } from './gameLogic';
import './Game.css';

const Game = () => {
  const initialBoard = Array(4).fill(null).map(() => Array(4).fill(null).map(() => Array(4).fill(null)));
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [firstMove, setFirstMove] = useState('Player');

  useEffect(() => {
    if (currentPlayer === 'O' && firstMove === 'Computer' && !winner) {
      const bestMove = getBestMove(board);
      if (bestMove) {
        handleClick(bestMove.layer, bestMove.row, bestMove.col);
      }
    }
  }, [currentPlayer, firstMove, winner, board]);

  const handleClick = (layer, row, col) => {
    if (board[layer][row][col] || winner) return;

    const newBoard = board.map((layerArr, lIndex) =>
      layerArr.map((rowArr, rIndex) =>
        rowArr.map((cell, cIndex) =>
          lIndex === layer && rIndex === row && cIndex === col ? currentPlayer : cell
        )
      )
    );

    setBoard(newBoard);
    const newWinner = checkWinner(newBoard);
    setWinner(newWinner);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const handleFirstMoveChange = (event) => {
    const move = event.target.value;
    setFirstMove(move);
    setCurrentPlayer(move === 'Player' ? 'X' : 'O');

    const resetBoard = initialBoard.map(layer => layer.map(row => row.slice()));
    setBoard(resetBoard);
    setWinner(null);

    if (move === 'Computer') {
      const bestMove = getBestMove(resetBoard);
      if (bestMove) {
        resetBoard[bestMove.layer][bestMove.row][bestMove.col] = 'O';
        setBoard(resetBoard);
        setCurrentPlayer('X');
      }
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setWinner(null);
    setCurrentPlayer('X');
    setFirstMove('Player');
  };

  return (
    <div className="game">
      <div>
        <label>
          <input
            type="radio"
            value="Player"
            checked={firstMove === 'Player'}
            onChange={handleFirstMoveChange}
          />
          Play with Friend
        </label>
        <label>
          <input
            type="radio"
            value="Computer"
            checked={firstMove === 'Computer'}
            onChange={handleFirstMoveChange}
          />
          Play with Computer 
        </label>
      </div>
      <Board board={board} onClick={handleClick} />
      {winner && (
        <div>
          <p>Winner: {winner === 'X' ? (firstMove === 'Player' ? 'Player 1' : 'Player') : (firstMove === 'Player' ? 'Player 2' : 'Computer')}</p>
          <button onClick={resetGame}>Start A New Game</button>
        </div>
      )}
    </div>
  );
};

export default Game;
