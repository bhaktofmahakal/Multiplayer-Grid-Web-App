# 🎮 Multiplayer Grid Web App

A real-time multiplayer web application where players collaboratively fill a 10x10 grid with Unicode characters. Built with React, Node.js/Express, TypeScript, and Socket.IO.

## 📋 Features

### Core Features
- ✅ **Multiplayer Gameplay**: Connect multiple players on the same 10x10 grid
- ✅ **Real-time Updates**: All grid changes broadcast instantly to connected players
- ✅ **Unicode Character Support**: Place any Unicode character on grid cells
- ✅ **Online Player Counter**: See how many players are currently connected
- ✅ **Cell Information**: Hover over cells to see who placed what character

### Advanced Features
- ✅ **1-Minute Cooldown**: After placing a character, players must wait 60 seconds before updating again
- ✅ **Update History**: View the last 50 grid updates with timestamps
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Error Handling**: Real-time error notifications and validation

## 🏗️ Project Structure

```
u:\Task/
├── backend/                    # Node.js/Express server
│   ├── src/
│   │   └── index.ts           # Main server with Socket.IO
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                  # Compiled JavaScript (after build)
├── frontend/                   # React application
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   ├── App.css            # Styles
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tsconfig.json
├── tests/                      # E2E tests (Playwright)
│   ├── grid.spec.ts           # Main test suite
│   └── playwright.config.ts   # Playwright configuration
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd u:\Task\backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd u:\Task\frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server** (Terminal 1)
   ```bash
   cd u:\Task\backend
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

2. **Start Frontend Dev Server** (Terminal 2)
   ```bash
   cd u:\Task\frontend
   npm start
   ```
   Frontend runs on `http://localhost:3000`

3. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Register with a player name
   - Start playing!

## 🎮 How to Play

1. **Register**: Enter your player name and click "Register"
2. **Select Cell**: Click on any empty or filled cell in the 10x10 grid
3. **Enter Character**: Type a single Unicode character in the input field
4. **Update**: Click "Update Cell" or press Enter
5. **Wait**: After updating, you'll need to wait 60 seconds before updating again
6. **View History**: Click "Show History" to see recent grid updates

## 📡 Socket.IO Events

### Client → Server
- `register`: Register a player with a name
- `updateCell`: Place a character at grid[row][col]
- `getGridState`: Request current grid state
- `getHistory`: Request update history
- `getCooldownStatus`: Check if player is on cooldown

### Server → Client
- `gridUpdate`: Grid state and history update
- `playerCountUpdate`: Online players count
- `updateSuccess`: Successful cell update confirmation
- `error`: Error message with details
- `cooldownStatus`: Current cooldown status

## 🔧 API Endpoints

### REST
- `GET /health` - Health check endpoint

### Socket.IO
All communication happens via Socket.IO WebSocket connections for real-time updates.

## 📝 Game Rules

1. **One Character Per Cell**: Each cell can be updated by any player
2. **Cooldown System**: Players must wait 60 seconds after each update
3. **Persistent History**: Last 50 updates are tracked with timestamps
4. **Real-time Broadcast**: All updates instantly visible to all connected players

## 🧪 Testing

### Running E2E Tests (Playwright)
```bash
cd u:\Task
npx playwright test
```

### Running Tests in UI Mode
```bash
cd u:\Task
npx playwright test --ui
```

## 🏗️ Building for Production

1. **Build Backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

## 🔐 Environment Variables

Create `.env` file in backend directory (optional):
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Connection Refused
- Ensure backend is running on port 5000
- Check firewall settings

### Grid Not Updating
- Verify Socket.IO connection in browser DevTools
- Check console for errors

### Cooldown Not Working
- Clear browser local storage
- Refresh the page

## 📚 Technologies Used

- **Frontend**: React 18, TypeScript, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO, TypeScript
- **Testing**: Playwright
- **Styling**: CSS3 with CSS Variables
- **Real-time Communication**: WebSocket (Socket.IO)

## 👤 Author

**Applicant**

## 📄 License

ISC

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- React team for the amazing UI library
- Express.js for the minimal web framework

---

Made with ❤️ for the Avatar Team Interview