import { useRef, useState } from 'react'
import './App.css'
import ChatBubble from './components/ChatBubble'
import { useUserStore } from './store'

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

  const { setUsername, username } = useUserStore();
  const [password, setPassword] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')
  const [users, setUsers] = useState<string[]>([])
  const [response, setResponse] = useState<string>('')
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

  async function registerUser(name: string, password: string) {
    let newUser = JSON.stringify({
      name: name,
      password: password
    })

    try{

      const res = await fetch(import.meta.env.VITE_SERVER_URL + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: newUser
      })

      if(!res.ok) throw new Error("Failed to Create User")
      
      let data = await res.json()
      setResponse(data.response)
      setUsername('')
      setPassword('')
    } catch (err) {
      console.log(err)
    }

  }

  async function loginAndConnect(name: string, password: string) {

    let user = JSON.stringify({
      name: name,
      password: password
    })
    try {
      const res = await fetch(import.meta.env.VITE_SERVER_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: user
      })

      if (!res.ok) throw new Error("Failed To Login")

      let data = await res.json()
      if (data.token) {
          connect(data.token); 
      } else {
          setResponse(data.response)
      }

    } catch (e) {
      console.log()
    }
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
    if (users.includes(user)) return
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
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'row' }}>
        <img src="/images/logo.png" alt="logo" width={80} />
        <h2>Chatty McChatface</h2>
        <select>
          {
            users.map((user, index) => {
              return <option key={user + index}>{user}</option>
            })
          }
        </select>
      </div>

      <div className="chat-window" style={{
        overflowY: 'scroll',
        height: '80vh',
        width: '70vw',
        margin: '0 auto',
        marginTop: '10px',
        textAlign: 'left',
        boxSizing: 'border-box'
      }}>
        {
          messages.map(msg => (
            <ChatBubble key={msg.createdAt.toString()} message={msg} />
          ))
        }
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <input type="text" style={{ padding: 20 }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => {
          console.log(e)
          if (e.key === 'Enter') {
            sendMessage('message', username)
          }
        }} />
      </div>

      {
        !connected && (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'gray', borderRadius: '10px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
            <h1>Welcome To Chatty McChatface</h1>
            <h3>Login Or Register</h3>
            <hr />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <img src="/images/logo.png" alt="logo" width={80} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <h4>Login:</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  loginAndConnect(username, password);
                  }}>
                  <label >Please Give A Username: </label>
                  <input type="text" value={username} autoComplete='username' onChange={(e) => setUsername(e.target.value)} style={{ padding: 20 }} />
                  <input type='password' value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} style={{ padding: 20 }} />
                  <button type='submit'>Login</button>
                </form>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <h4>Register:</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  registerUser(username, password);
                  }}>
                  <label >Please Give A Username: </label>
                  <input type="text" value={username} autoComplete='username' onChange={(e) => setUsername(e.target.value)} style={{ padding: 20 }} />
                  <input type='password' value={password} autoComplete='new-password' onChange={(e) => setPassword(e.target.value)} style={{ padding: 20 }} />
                  <button type='submit'>Register</button>
                </form>
                <p>{response}</p>
              </div>
            </div>


          </div>)
      }

    </>
  )
}

export default App
