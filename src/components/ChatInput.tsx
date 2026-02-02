import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useUserStore } from "../store";
import { useState } from "react";
import type { MessageType } from "../Types";

type Props = {
    sendMessage: (type: MessageType, name: string, message: string) => void;
    connected: boolean;
}

export default function ChatInput({sendMessage, connected}: Props){

    const { username } = useUserStore();
    const [messageToSend, setMessageToSend] = useState<string>('');
    const [showEmojis, setShowEmojis] = useState<boolean>(false)

    function handleEmoji(emojiObject: EmojiClickData){
        setMessageToSend(prev => prev + " " + emojiObject.emoji);
    }

    return(
        <div className="input-container" style={{ display: connected ? 'flex' : 'none'}}>
            <input
            type="text"
            className="chat-input"
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
            console.log(e)
            if (e.key === 'Enter') {
                sendMessage('message', username, messageToSend.trim())
                setMessageToSend('')
            }
            }} 
            />
            <button onClick={() => setShowEmojis(prev => !prev)}>Mojis</button>
            <div style={{position: 'absolute', bottom: 0}}>
                <EmojiPicker open={showEmojis} onEmojiClick={(emojiObject) => {
                                handleEmoji(emojiObject)}} />
            </div>
            
      </div>
    )

}