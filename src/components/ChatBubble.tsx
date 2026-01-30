import type { Message } from "../App";
import { useUserStore } from "../store";

export default function ChatBubble({ message }: { message: Message }) {
 
    const { username } = useUserStore()

    return(
        <div className="chat-bubble" style={{
            backgroundColor: message.from === username ? 'rgb(54, 204, 167)' : 'rgb(54, 194, 204)' ,
            borderRadius: '10px', 
            padding: '5px',
            margin: '10px',
            width : '80%',
            alignSelf: message.from === username ? 'flex-end' : 'flex-start',
            boxShadow: '10px 5px 10px 1px black'
            }}>
            <strong style={{ margin: '10px' }}>{message.from}:</strong>
            <p style={{ margin: '10px' }}>{message.content}</p>
        </div>
    )
}