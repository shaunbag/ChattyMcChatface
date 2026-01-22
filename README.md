# Chatty McChatface 💬

A real-time web chat application built with React and WebSocket technology. This app enables users to register, authenticate, and chat with other users in real-time through a secure WebSocket connection with JWT-based authentication.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSocket connections
- **User Registration**: Create new accounts with username and password
- **Secure Authentication**: JWT-based authentication system with password protection
- **User List**: Display of all online users in the chat
- **Modern UI**: Clean and responsive chat interface with message bubbles
- **Login/Register Modal**: Intuitive authentication interface on first visit
- **Enter to Send**: Quick message sending with Enter key support
- **Auto-scroll Chat**: Scrollable chat window for message history

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Zustand** - Lightweight state management
- **WebSocket API** - Real-time bidirectional communication
- **JWT** - Secure token-based authentication

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The [ExpressWebsocketServer](https://github.com/shaunbag/WebsocketExpressServer) backend server running

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ChattyMcChatFace
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_SERVER_URL=http://localhost:4000
VITE_WEBSOCKET_URL=ws://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

5. Make sure the backend WebSocket server is running on `http://localhost:4000`

6. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 📖 Usage

1. **Register or Login**: When you first open the app, you'll see a welcome modal with two options:
   - **Register**: Create a new account by entering a username and password, then click "Register"
   - **Login**: Enter your existing username and password, then click "Login"

2. **Start Chatting**: Once authenticated and connected, you can:
   - Type messages in the input field at the bottom
   - Press Enter to send messages
   - View messages from all connected users with timestamps
   - See the list of online users in the dropdown at the top
   - View the application logo and title in the header

3. **Real-time Updates**: Messages and user lists update automatically as users join, leave, or send messages

## 🏗️ Project Structure

```
ChattyMcChatFace/
├── src/
│   ├── components/
│   │   └── ChatBubble.tsx    # Message bubble component
│   ├── App.tsx                # Main application component with auth logic
│   ├── store.ts               # Zustand state management for username
│   ├── main.tsx               # Application entry point
│   ├── App.css                # Application styles
│   └── index.css              # Global styles
├── public/
│   └── images/
│       └── logo.png           # Application logo
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🔌 Backend Server

This application requires the **ExpressWebsocketServer** to be running. The backend server source code can be found at:
https://github.com/shaunbag/WebsocketExpressServer

The app connects to:
- **WebSocket**: `ws://localhost:4000` (with JWT token authentication)
- **REST API Endpoints**:
  - `POST /register` - Register a new user
  - `POST /login` - Authenticate and receive JWT token

### Authentication Flow

1. User registers or logs in via REST API
2. Server returns a JWT token on successful authentication
3. Client connects to WebSocket using the JWT token as a query parameter
4. WebSocket connection is established and user can send/receive messages

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features in Detail

### Authentication System
- **Registration**: Users can create new accounts with unique usernames and passwords
- **Login**: Secure password-based authentication
- **JWT Tokens**: Token-based authentication for WebSocket connections
- **Session Management**: Username stored in Zustand store for session persistence

### Message Types
The application handles different message types:
- `message` - Regular chat messages from users
- `users` - List of connected users (sent as JSON string)
- `addUser` - User join notifications

### State Management
- **Zustand Store**: Manages username globally across the application
- **React State**: Messages and user lists managed with React useState hooks
- **WebSocket Reference**: Uses useRef to maintain WebSocket connection

### UI Components
- **Login/Register Modal**: Centered modal with forms for authentication
- **Chat Window**: Scrollable message display area
- **User Dropdown**: Select element showing all online users
- **Message Input**: Fixed bottom input with Enter key support
- **Chat Bubbles**: Styled message components showing sender and content

## 🔒 Security Features

- Password-based authentication
- JWT token validation for WebSocket connections
- Secure password input fields (type="password")
- Token-based session management

## 🌐 Environment Variables

The application uses the following environment variables (configure in `.env` file):

- `VITE_SERVER_URL` - Base URL for REST API endpoints (default: `http://localhost:4000`)
- `VITE_WEBSOCKET_URL` - WebSocket server URL (default: `ws://localhost:4000`)

## 📝 Notes

- The application automatically handles WebSocket reconnection on authentication
- User list is dynamically updated as users join and leave
- Messages include sender information and are displayed in chronological order
- The chat interface is responsive and works on different screen sizes
