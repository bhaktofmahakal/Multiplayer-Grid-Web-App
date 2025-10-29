import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Types
interface GridCell {
  character: string;
  playerId: string;
  playerName: string;
  timestamp: number;
}

interface PlayerState {
  id: string;
  name: string;
  canUpdate: boolean;
  lastUpdateTime: number;
  cooldownEndTime: number;
}

interface GridUpdate {
  row: number;
  col: number;
  character: string;
  playerId: string;
  playerName: string;
  timestamp: number;
}

// Game state
const grid: (GridCell | null)[][] = Array(10)
  .fill(null)
  .map(() => Array(10).fill(null));

const players = new Map<string, PlayerState>();
const updateHistory: GridUpdate[] = [];
const COOLDOWN_DURATION = 60000; // 1 minute in milliseconds

// Helper functions
const updatePlayer = (playerId: string, playerState: PlayerState) => {
  players.set(playerId, playerState);
};

const canPlayerUpdate = (playerId: string): boolean => {
  const player = players.get(playerId);
  if (!player) return true;

  const now = Date.now();
  if (player.cooldownEndTime && now < player.cooldownEndTime) {
    return false;
  }
  return true;
};

const setPlayerCooldown = (playerId: string) => {
  const player = players.get(playerId);
  if (player) {
    player.cooldownEndTime = Date.now() + COOLDOWN_DURATION;
    updatePlayer(playerId, player);
  }
};

const broadcastGridState = () => {
  io.emit('gridUpdate', {
    grid,
    onlinePlayers: players.size,
    history: updateHistory.slice(-50), // Send last 50 updates
  });
};

const broadcastPlayerCount = () => {
  io.emit('playerCountUpdate', {
    onlinePlayers: players.size,
  });
};

// Socket.IO events
io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Register player
  socket.on('register', (playerName: string) => {
    const playerState: PlayerState = {
      id: socket.id,
      name: playerName,
      canUpdate: true,
      lastUpdateTime: 0,
      cooldownEndTime: 0,
    };

    updatePlayer(socket.id, playerState);
    console.log(`Player registered: ${playerName} (${socket.id})`);

    // Send current grid state to the new player
    socket.emit('gridUpdate', {
      grid,
      onlinePlayers: players.size,
      history: updateHistory.slice(-50),
    });

    // Broadcast updated player count
    broadcastPlayerCount();
  });

  // Update grid cell
  socket.on('updateCell', (data: { row: number; col: number; character: string }) => {
    const { row, col, character } = data;
    const player = players.get(socket.id);

    if (!player) {
      socket.emit('error', { message: 'Player not registered' });
      return;
    }

    // Validate coordinates
    if (row < 0 || row >= 10 || col < 0 || col >= 10) {
      socket.emit('error', { message: 'Invalid grid coordinates' });
      return;
    }

    // Validate character
    if (character.length !== 1) {
      socket.emit('error', { message: 'Character must be a single Unicode character' });
      return;
    }

    // Check if player can update
    if (!canPlayerUpdate(socket.id)) {
      const remainingTime = Math.ceil((player.cooldownEndTime - Date.now()) / 1000);
      socket.emit('error', {
        message: `Cooldown active. Try again in ${remainingTime} seconds`,
        cooldownRemaining: remainingTime,
      });
      return;
    }

    // Update grid
    const gridCell: GridCell = {
      character,
      playerId: socket.id,
      playerName: player.name,
      timestamp: Date.now(),
    };

    grid[row][col] = gridCell;

    // Record update in history
    const update: GridUpdate = {
      row,
      col,
      character,
      playerId: socket.id,
      playerName: player.name,
      timestamp: Date.now(),
    };

    updateHistory.push(update);

    // Set cooldown for player
    setPlayerCooldown(socket.id);

    // Update player state
    player.lastUpdateTime = Date.now();
    updatePlayer(socket.id, player);

    console.log(`Grid updated: [${row}, ${col}] = "${character}" by ${player.name}`);

    // Broadcast updated grid to all players
    broadcastGridState();

    socket.emit('updateSuccess', { message: 'Grid updated successfully' });
  });

  // Get grid state
  socket.on('getGridState', () => {
    socket.emit('gridUpdate', {
      grid,
      onlinePlayers: players.size,
      history: updateHistory.slice(-50),
    });
  });

  // Get update history
  socket.on('getHistory', () => {
    socket.emit('historyUpdate', {
      history: updateHistory.slice(-50),
    });
  });

  // Get player cooldown status
  socket.on('getCooldownStatus', () => {
    const player = players.get(socket.id);
    if (player && player.cooldownEndTime > Date.now()) {
      const remainingTime = Math.ceil((player.cooldownEndTime - Date.now()) / 1000);
      socket.emit('cooldownStatus', {
        onCooldown: true,
        remainingSeconds: remainingTime,
      });
    } else {
      socket.emit('cooldownStatus', {
        onCooldown: false,
        remainingSeconds: 0,
      });
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    players.delete(socket.id);
    console.log(`Client disconnected: ${socket.id}`);
    broadcastPlayerCount();
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', onlinePlayers: players.size });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});