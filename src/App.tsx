import { useEffect, useRef, useState } from 'react'
import './App.css'
import ChatBubble from './components/ChatBubble'
import { useUserStore } from './store'

export type Message = {
  type: 'message' | 'users' | 'addUser';
  from: string;
  content: string;
}

type User = {
  name:string;
  id: string;
}

function App() {

  const { setUsername, username } = useUserStore();
  const [name, setName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')
  const [users, setUsers] = useState<string[]>([])
  const wsRef = useRef<WebSocket | null>(null);


  function connect(jwt: string) {
      const ws = new WebSocket('ws://localhost:4000' + '?userId=' + jwt);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      ws.onmessage = (event) => {
        const newMessage: Message = JSON.parse(event.data);
        handleWebsocketMessage(newMessage)
      };

  }

  async function loginAndConnect(name: string){

    let newUser = JSON.stringify({
      name: name,
      password: "nothing for now"
    })
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: newUser
      })

      if(!res.ok) throw new Error("Failed To Login Loser")

      let data = await res.json()
      if(data != null) {
        connect(data.token)
      }
    } catch (e){
      console.log()
    }
  }

  function handleWebsocketMessage(message: Message){
      switch(message.type){
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

  function addUsersOnline(user: string){
    if(users.includes(user)) return
    setUsers(prev => [...prev, user])
  }

  const sendMessage = (type: string, name: string) => {
    const fullMessage = {
      type: type,
      from: name,
      content: message
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
            users.map(user => {
              return <option key={user}>{user}</option>
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
          messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))
        }
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <input type="text" style={{padding:20}} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => {
          console.log(e)
          if(e.key === 'Enter'){
            sendMessage('message', username)
          }
        }}/>
      </div>

      {
        !username && (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'gray', borderRadius: '10px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
            <h1>Welcome To Chatty McChatface</h1>
            <img src="/images/logo.png" alt="logo" width={80} />
            <p>Please Give A Username: </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{padding:20}}/>
              <button onClick={() => {
                if (name.trim().length > 0) {
                  setUsername(name.trim());
                  loginAndConnect(name.trim())
                }
              }}>Enter Chat</button>
            </div>

          </div>)
      }

    </>
  )
}

export default App
