import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

interface GridCell {
  character: string;
  playerId: string;
  playerName: string;
  timestamp: number;
}

interface GridUpdate {
  row: number;
  col: number;
  character: string;
  playerId: string;
  playerName: string;
  timestamp: number;
}

function App() {
  const [grid, setGrid] = useState<(GridCell | null)[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(null))
  );
  const [playerName, setPlayerName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [character, setCharacter] = useState('');
  const [updateHistory, setUpdateHistory] = useState<GridUpdate[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    socketRef.current = io(apiUrl, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('gridUpdate', (data) => {
      setGrid(data.grid);
      setOnlinePlayers(data.onlinePlayers);
      setUpdateHistory(data.history);
    });

    socketRef.current.on('playerCountUpdate', (data) => {
      setOnlinePlayers(data.onlinePlayers);
    });

    socketRef.current.on('error', (data) => {
      setError(data.message);
      if (data.cooldownRemaining) {
        setCooldownRemaining(data.cooldownRemaining);
        startCooldownTimer(data.cooldownRemaining);
      }
      setTimeout(() => setError(''), 3000);
    });

    socketRef.current.on('updateSuccess', (data) => {
      setSuccess(data.message);
      setCharacter('');
      setSelectedCell(null);
      setTimeout(() => setSuccess(''), 2000);
    });

    socketRef.current.on('cooldownStatus', (data) => {
      if (data.onCooldown) {
        setCooldownRemaining(data.remainingSeconds);
        startCooldownTimer(data.remainingSeconds);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Cooldown timer
  const startCooldownTimer = (seconds: number) => {
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }

    let remaining = seconds;
    cooldownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setCooldownRemaining(remaining);

      if (remaining <= 0) {
        if (cooldownIntervalRef.current) {
          clearInterval(cooldownIntervalRef.current);
        }
      }
    }, 1000);
  };

  // Register player
  const handleRegister = () => {
    if (!playerName.trim()) {
      setError('Please enter a player name');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (socketRef.current) {
      socketRef.current.emit('register', playerName);
      setIsRegistered(true);
      setSuccess(`Welcome, ${playerName}!`);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (!isRegistered) {
      setError('Please register first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSelectedCell([row, col]);
  };

  // Handle character update
  const handleUpdateCell = () => {
    if (!selectedCell || !character.trim()) {
      setError('Please select a cell and enter a character');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (character.length !== 1) {
      setError('Please enter exactly one character');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (socketRef.current) {
      socketRef.current.emit('updateCell', {
        row: selectedCell[0],
        col: selectedCell[1],
        character,
      });
    }
  };

  // Handle key press for quick update
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateCell();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎮 Multiplayer Grid</h1>
        <div className="header-info">
          <span className="players-online">👥 Online: {onlinePlayers}</span>
          {cooldownRemaining > 0 && (
            <span className="cooldown-info">⏱️ Cooldown: {cooldownRemaining}s</span>
          )}
        </div>
      </header>

      <main className="container">
        {!isRegistered ? (
          <div className="registration">
            <h2>Join the Game</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter your player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleRegister();
                }}
              />
              <button onClick={handleRegister} className="btn btn-primary">
                Register
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid-container">
              <div className="grid">
                {grid.map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="grid-row">
                    {row.map((cell, colIndex) => (
                      <div
                        key={`cell-${rowIndex}-${colIndex}`}
                        className={`grid-cell ${
                          selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                            ? 'selected'
                            : ''
                        } ${cell ? 'filled' : ''}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        title={cell ? `${cell.character} by ${cell.playerName}` : 'Empty'}
                      >
                        {cell && <span className="cell-content">{cell.character}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="control-panel">
              {selectedCell && (
                <div className="cell-info">
                  <p>Selected: [{selectedCell[0]}, {selectedCell[1]}]</p>
                </div>
              )}

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter Unicode character"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value.slice(0, 1))}
                  onKeyPress={handleKeyPress}
                  maxLength={1}
                  disabled={cooldownRemaining > 0}
                />
                <button
                  onClick={handleUpdateCell}
                  className="btn btn-primary"
                  disabled={!selectedCell || !character || cooldownRemaining > 0}
                >
                  {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Update Cell'}
                </button>
              </div>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="btn btn-secondary"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>

            {showHistory && (
              <div className="history-panel">
                <h3>Recent Updates</h3>
                <div className="history-list">
                  {updateHistory.length === 0 ? (
                    <p>No updates yet</p>
                  ) : (
                    updateHistory
                      .slice()
                      .reverse()
                      .map((update, index) => (
                        <div key={index} className="history-item">
                          <span className="history-cell">[{update.row}, {update.col}]</span>
                          <span className="history-char">{update.character}</span>
                          <span className="history-player">{update.playerName}</span>
                          <span className="history-time">
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </main>
    </div>
  );
}

export default App;