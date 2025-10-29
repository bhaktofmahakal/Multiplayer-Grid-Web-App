# Frontend - Multiplayer Grid React App

React TypeScript application for the multiplayer grid game with real-time Socket.IO integration.

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm
- Backend server running on localhost:5000

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

App runs on `http://localhost:3000`

### Production Build

```bash
npm run build
```

## 🎮 Features

### User Interface
- **Grid Display**: 10x10 interactive grid with visual feedback
- **Player Registration**: One-time name entry for multiplayer sessions
- **Cell Selection**: Click-based cell selection with visual indicators
- **Character Input**: Single Unicode character input with validation
- **Online Counter**: Real-time display of connected players
- **Cooldown Timer**: Visual countdown after cell update
- **Update History**: View recent grid changes with timestamps
- **Responsive Design**: Mobile-friendly layout

### Components

#### `App.tsx` - Main Component
- Socket.IO connection management
- Grid state management
- Player registration logic
- Cell update handling
- History tracking
- Cooldown timer logic

#### `App.css` - Styling
- Modern, clean design
- CSS variables for theming
- Responsive grid layout
- Animations and transitions
- Mobile breakpoints (768px, 480px)

## 🔌 Socket.IO Integration

### Connected Events

```typescript
socket.on('gridUpdate', (data) => {
  // Update local grid state
  // Update online players count
  // Update history
})

socket.on('playerCountUpdate', (data) => {
  // Update online players display
})

socket.on('error', (data) => {
  // Show error message
  // Handle cooldown errors
})

socket.on('updateSuccess', (data) => {
  // Clear character input
  // Deselect cell
})

socket.on('cooldownStatus', (data) => {
  // Start countdown timer
})
```

### Emitted Events

```typescript
socket.emit('register', playerName)
socket.emit('updateCell', { row, col, character })
socket.emit('getGridState')
socket.emit('getHistory')
socket.emit('getCooldownStatus')
```

## 🎨 Design System

### Color Palette
```css
--primary-color: #10b981       /* Green */
--secondary-color: #3b82f6     /* Blue */
--error-color: #ef4444         /* Red */
--success-color: #10b981       /* Green */
--bg-color: #f3f4f6           /* Light gray */
--card-bg: #ffffff            /* White */
--border-color: #e5e7eb       /* Light border */
--text-color: #1f2937         /* Dark text */
--text-light: #6b7280         /* Light text */
```

### Typography
- Font: System font stack
- Base size: 16px
- Headings: 500-700 weight

### Spacing
- Base unit: 1rem (16px)
- Grid gap: 0 (seamless)
- Padding: 0.75rem - 2rem

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px (50px cells)
- **Tablet**: 480px - 768px (40px cells)
- **Mobile**: < 480px (30px cells)

## 🎯 User Workflows

### 1. Registration
```
User enters name → Click Register → Join game
```

### 2. Cell Update
```
Click cell → Enter character → Click Update/Press Enter
→ Grid broadcasts → Cooldown starts
```

### 3. View History
```
Click "Show History" → View recent updates with timestamps
```

## ✅ Validation

- Player name: Non-empty string
- Grid coordinates: 0-9 range
- Character: Exactly one Unicode character
- Cooldown: 60-second enforced wait

## 🔧 Configuration

### Connection Settings
```typescript
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
})
```

## 📊 State Management

```typescript
// Grid State
const [grid, setGrid] = useState<(GridCell | null)[][]>

// Player Info
const [playerName, setPlayerName] = useState('')
const [isRegistered, setIsRegistered] = useState(false)

// Game State
const [selectedCell, setSelectedCell] = useState<[number, number] | null>
const [character, setCharacter] = useState('')
const [onlinePlayers, setOnlinePlayers] = useState(0)

// History
const [updateHistory, setUpdateHistory] = useState<GridUpdate[]>
const [showHistory, setShowHistory] = useState(false)

// Cooldown
const [cooldownRemaining, setCooldownRemaining] = useState(0)

// Notifications
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
```

## 🐛 Debugging

### Browser Console
Check for Socket.IO connection logs and errors.

### Network Tab
Monitor Socket.IO WebSocket frames in DevTools.

### Local Storage
Check for any stored player preferences.

## 📦 Dependencies

- **react**: UI library
- **react-dom**: DOM rendering
- **socket.io-client**: Real-time communication
- **typescript**: Type safety

## 📄 License

ISC