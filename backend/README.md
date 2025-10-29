# Backend - Multiplayer Grid Server

Node.js/Express server with Socket.IO for real-time multiplayer grid game.

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## 🔌 Socket.IO Events

### Emitted Events (Server → Client)

#### `gridUpdate`
Emitted when grid state changes
```typescript
{
  grid: (GridCell | null)[][]
  onlinePlayers: number
  history: GridUpdate[]
}
```

#### `playerCountUpdate`
Emitted when player joins/leaves
```typescript
{
  onlinePlayers: number
}
```

#### `updateSuccess`
Emitted after successful cell update
```typescript
{
  message: string
}
```

#### `error`
Emitted when operation fails
```typescript
{
  message: string
  cooldownRemaining?: number
}
```

#### `cooldownStatus`
Emitted when cooldown status is requested
```typescript
{
  onCooldown: boolean
  remainingSeconds: number
}
```

### Listening Events (Client → Server)

#### `register`
Register a new player
```
socket.emit('register', playerName)
```

#### `updateCell`
Update a grid cell
```typescript
socket.emit('updateCell', {
  row: number
  col: number
  character: string
})
```

#### `getGridState`
Request current grid state
```
socket.emit('getGridState')
```

#### `getHistory`
Request update history
```
socket.emit('getHistory')
```

#### `getCooldownStatus`
Check player's cooldown status
```
socket.emit('getCooldownStatus')
```

## 📋 Game Logic

### Validation Rules
1. **Grid Coordinates**: 0-9 for both row and column
2. **Character**: Exactly one Unicode character
3. **Cooldown**: 60-second wait after each update
4. **Player Registration**: Required before any grid operations

### State Management
- In-memory grid state (10x10)
- Per-player cooldown tracking
- Last 50 updates in history
- Connected players map

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📊 API Endpoints

### REST
- `GET /health` - Server health check

## 🏗️ Architecture

```
src/index.ts
├── Express app setup
├── Socket.IO server
├── Game state management
└── Event handlers
```

## 🐛 Debugging

Enable detailed logging in development:
```bash
DEBUG=* npm run dev
```

## 📝 Code Structure

```typescript
// Types
interface GridCell
interface PlayerState
interface GridUpdate

// Game State
const grid: (GridCell | null)[][]
const players: Map<string, PlayerState>
const updateHistory: GridUpdate[]

// Constants
const COOLDOWN_DURATION = 60000

// Helper Functions
- updatePlayer()
- canPlayerUpdate()
- setPlayerCooldown()
- broadcastGridState()
- broadcastPlayerCount()

// Socket Events
- connection
- register
- updateCell
- getGridState
- getHistory
- getCooldownStatus
- disconnect
```

## ✅ Testing

Test server connectivity:
```bash
curl http://localhost:5000/health
```

## 📦 Dependencies

- **express**: Web framework
- **socket.io**: Real-time communication
- **cors**: Cross-origin resource sharing
- **typescript**: Type safety

## 📄 License

ISC