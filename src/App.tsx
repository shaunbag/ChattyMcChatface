import { useRef, useState } from 'react'
import './App.css'
import ChatBubble from './components/ChatBubble'
import { useUserStore } from './store'
import LoginPage from './components/LoginPage'
import bg from './assets/background.jpg';
import ChatInput from './components/ChatInput'
import type { Message, MessageType, User } from './Types'

function App() {

  const { username, setUsername } = useUserStore();
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [connected, setConnected] = useState<boolean>(false)
  const wsRef = useRef<WebSocket | null>(null);


  function connect(jwt: string) {
    const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}?token=${jwt}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setConnected(true)
    };

    ws.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      handleWebsocketMessage(newMessage)
    };

  }



  function handleWebsocketMessage(message: Message) {
    switch (message.type) {
      case 'message':
        setMessages(prev => [...prev, message]);
        addUsersOnline(message.from)
        break;
      case 'users':
        let users: User[] = JSON.parse(message.content)
        users.forEach(user => {
          addUsersOnline(user.name)
        })
        break;
      case 'reaction':
          updateMessage(message)
        break;
      default:
        console.log("Invalid Message")
        return
    }
  }

  function addUsersOnline(user: string) {
    if (users.some(u => u === user) || user === "" || user === username) return
    setUsers(prev => [...prev, user])
  }

  const sendMessage = (type: MessageType, name: string, message: string) => {
    const fullMessage: Message = {
      type: type,
      from: name,
      content: message,
      createdAt: Date.now(),
      reactions: []
    }
    wsRef.current?.send(JSON.stringify(fullMessage));
  }

  function updateMessage(updatedMessage: Message){
    setMessages(prev => 
      prev.map(message => 
        message.createdAt === updatedMessage.createdAt ? updatedMessage : message
      )
    )
  }

  return (
    <main style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'none', minHeight: '100vh' }}>
      <div className="app-header">
        <img src="/images/logo.png" alt="logo" className="app-logo" />
        <h2 className="app-title">Chatty McChatface</h2>
        {/* {
          users.length > 0 ?
            <select className='custom-select'>
              {
                users.map((user, index) => {
                  return <option key={user + index}>{user}</option>
                })
              }
            </select>
            :
            null
        } */}
        {
          connected && (
            <button className="logout-button" onClick={() => {
              wsRef.current?.close();
              setConnected(false);
              setMessages([]);
              setUsers([]);
              setUsername('');
            }}>Logout</button>
          )
        }
      </div>
      <div className="app-layout">
        <div className="chat-window">
          {
            messages.map(msg => (
              <ChatBubble key={msg.createdAt.toString()} message={msg} updateMessage={updateMessage} wsRef={wsRef}/>
            ))
          }
        </div>
      </div>

      <ChatInput sendMessage={sendMessage}  connected={connected}/>

      {
        !connected && (
          <LoginPage connect={connect} />
        )
      }

    </main>
  )
}

export default App
