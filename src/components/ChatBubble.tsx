import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { useUserStore } from '../store';
import type { Message, Reaction } from '../Types';
import { useState } from 'react';

type Props = {
    message: Message;
    updateMessage: (messages: Message) => void;
    wsRef: React.RefObject<WebSocket | null>;
}

export default function ChatBubble({ message, updateMessage, wsRef }: Props) {

    const { username } = useUserStore();
    const [showEmojis, setShowEmojis] = useState(false);
    const [hovered, setHovered] = useState(false)

    function addReaction(emojiObject: EmojiClickData) {
        const reactions: Reaction[] = message.reactions.map(reaction => 
            reaction.emoji === emojiObject.emoji ? {...reaction, count: reaction.count += 1} : reaction
        )

        const newReactions = reactions.some(r => r.emoji === emojiObject.emoji) 
        ? 
        reactions 
        : 
        [...reactions, { emoji: emojiObject.emoji, count: 1}]
        
        const messageToChange: Message = {
            ...message,
            type: 'reaction',
            reactions: newReactions
        }
        
        updateMessage(messageToChange)
        setShowEmojis(false)
        wsRef.current?.send(JSON.stringify(messageToChange))
    }

    return (
        <div className='chat-bubble-container' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <div className='chat-bubble' style={{
                    backgroundColor: message.from === username ? 'rgb(54, 204, 167)' : 'rgb(54, 194, 204)',
                    marginLeft: message.from === username ? 'auto' : '0',
                }}>
                    {
                        message.from === username ?
                            <div>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        transform: 'translate(-65px, 10px)',
                                        display: hovered ? 'inline-block' : 'none',
                                        position: 'absolute'
                                    }}
                                    onClick={() => setShowEmojis(true)}>🤪</button>
                            </div>
                            :
                            null
                    }
                    <strong style={{ marginTop: '10px' }}>{message.from}:</strong>
                    <p style={{ marginTop: '10px' }}>{message.content}</p>
                    <div className='reactions' style={{
                        backgroundColor: message.from === username ? 'rgb(47, 177, 144)' : 'rgb(41, 157, 165)',
                    }}>
                        {
                            message.reactions.map(reaction => {
                                return <div key={reaction.emoji}>{reaction.emoji} {reaction.count}</div>
                            })
                        }
                    </div>
                </div>
                {
                    message.from !== username ?
                        <div>
                            <button
                                style={{
                                    backgroundColor: 'transparent',
                                    transform: 'translateY(25px)',
                                    display: hovered ? 'inline-block' : 'none',
                                    position: 'absolute',
                                }}
                                onClick={() => setShowEmojis(true)}>🤪</button>
                        </div>
                        :
                        null
                }
                <div style={{ position: 'absolute', top: 0, zIndex: 5 }}>
                    <EmojiPicker open={showEmojis} onEmojiClick={(emojiObject) => {
                        addReaction(emojiObject);
                    }} />
                </div>
            </div>
    )
}