import type { Message } from "../App";
import { useUserStore } from "../store";

export default function ChatBubble({ message }: { message: Message }) {
 
    const { username } = useUserStore()

    return(
        <div className="chat-bubble" style={{
            backgroundColor: message.from === username ? 'rgb(54, 204, 167)' : 'rgb(54, 194, 204)' ,
            borderRadius: '10px', 
            padding: '5px',
            margin: '4px',
            width : '80%',
            alignSelf: message.from === username ? 'flex-end' : 'flex-start'
            }}>
            <strong style={{ margin: '10px' }}>{message.from}:</strong>
            <p style={{ margin: '10px' }}>{message.content}</p>
        </div>
    )
}