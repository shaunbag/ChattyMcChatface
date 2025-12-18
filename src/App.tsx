import { useEffect, useRef, useState } from 'react'
import './App.css'
import ChatBubble from './components/ChatBubble'
import { useUserStore } from './store'

export type Message = {
  from: string;
  content: string;
}
function App() {

  const { setUsername, username } = useUserStore();
  const [name, setName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_SERVER);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket server: ', import.meta.env.VITE_WS_SERVER);
    };

    ws.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      setMessages(prev => [...prev, newMessage]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    const fullMessage = {
      from: username,
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
            sendMessage()
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
                }
              }}>Enter Chat</button>
            </div>

          </div>)
      }

    </>
  )
}

export default App
