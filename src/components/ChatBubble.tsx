import type { Message } from "../App";

export default function ChatBubble({ message }: { message: Message }) {
 
    return(
        <div className="chat-bubble" style={{
            backgroundColor: '#5e5e5eff',
            borderRadius: '10px', 
            padding: '5px',
            margin: '4px',}}>
            <strong style={{ margin: '10px' }}>{message.from}:</strong>
            <p style={{ margin: '10px' }}>{message.content}</p>
        </div>
    )
}