# Chatty McChatface 💬

A real-time web chat application built with React and WebSocket technology. This app enables users to connect, set a username, and chat with other users in real-time through a WebSocket connection.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSocket connections
- **User Authentication**: JWT-based authentication system
- **User List**: Display of all online users in the chat
- **Modern UI**: Clean and responsive chat interface with message bubbles
- **Username Management**: Simple username entry modal on first visit
- **Enter to Send**: Quick message sending with Enter key support

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Zustand** - Lightweight state management
- **WebSocket API** - Real-time bidirectional communication

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The [ExpressWebsocketServer](https://github.com/shaunbag/WebsocketExpressServer) backend server running on `localhost:4000`

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ws-chat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Make sure the backend WebSocket server is running on `http://localhost:4000`

5. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 📖 Usage

1. **Enter Username**: When you first open the app, you'll see a welcome modal. Enter your desired username and click "Enter Chat"

2. **Start Chatting**: Once connected, you can:
   - Type messages in the input field at the bottom
   - Press Enter to send messages
   - View messages from all connected users
   - See the list of online users in the dropdown at the top

3. **Real-time Updates**: Messages and user lists update automatically as users join, leave, or send messages

## 🏗️ Project Structure

```
ws-chat/
├── src/
│   ├── components/
│   │   └── ChatBubble.tsx    # Message bubble component
│   ├── App.tsx                # Main application component
│   ├── store.ts               # Zustand state management
│   ├── main.tsx               # Application entry point
│   ├── App.css                # Application styles
│   └── index.css              # Global styles
├── public/
│   └── images/
│       └── logo.png           # Application logo
├── package.json
├── vite.config.ts
└── README.md
```

## 🔌 Backend Server

This application requires the **ExpressWebsocketServer** to be running. The backend server source code can be found at:
https://github.com/shaunbag/WebsocketExpressServer

The app connects to:
- **WebSocket**: `ws://localhost:4000`
- **REST API**: `http://localhost:4000/login`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features in Detail

### Message Types
The application handles different message types:
- `message` - Regular chat messages
- `users` - List of connected users
- `addUser` - User join notifications

### State Management
- Username is stored using Zustand for global state management
- Messages and user lists are managed with React useState hooks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.
