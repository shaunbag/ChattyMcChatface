import { useRef, useState } from 'react'
import './App.css'
import ChatBubble from './components/ChatBubble'
import { useUserStore } from './store'
import LoginPage from './components/LoginPage'
import bg from './assets/background.jpg';

export type Message = {
  type: 'message' | 'users' | 'addUser';
  from: string;
  content: string;
  createdAt: Date;
}

type User = {
  name: string;
  id: string;
}

function App() {

  const { username } = useUserStore();
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')
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
      default:
        console.log("Invalid Message")
        return
    }
  }

  function addUsersOnline(user: string) {
    if (users.some(u => u === user) || user === "" || user === username) return
    setUsers(prev => [...prev, user])
  }

  const sendMessage = (type: string, name: string) => {
    const fullMessage = {
      type: type,
      from: name,
      content: message,
      createdAt: Date.now()
    }
    wsRef.current?.send(JSON.stringify(fullMessage));
    setMessage('');
  };

  return (
    <main style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'none', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'row' }}>
        <img src="/images/logo.png" alt="logo" width={80} />
        <h2>Chatty McChatface</h2>
        {
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
        }
      </div>
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div className="chat-window" style={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'scroll',
          height: '80vh',
          width: '70vw',
          margin: '0 auto',
          textAlign: 'left',
          boxSizing: 'border-box',
        }}>
          {
            messages.map(msg => (
              <ChatBubble key={msg.createdAt.toString()} message={msg} />
            ))
          }
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', display: connected ? 'flex' : 'none', justifyContent: 'center', padding: '10px' }}>
        <input type="text" style={{ padding: 20, backgroundColor: 'rgb(87, 199, 190)' }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => {
          console.log(e)
          if (e.key === 'Enter') {
            sendMessage('message', username)
          }
        }} />
      </div>

      {
        !connected && (
          <LoginPage connect={connect} />
        )
      }

    </main>
  )
}

export default App
