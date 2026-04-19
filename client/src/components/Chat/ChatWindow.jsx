import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import "../../styles/ChatWindow.css";

export default function ChatWindow({ messages, userId, myChat }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <MessageBubble
            key={message.timestamp}
            displayName={message.displayName}
            side={message.side}
            text={message.text}
            timestamp={message.timestamp}
            messageUserId={message.userId}
            myUserId={userId}
            myChat={myChat}
          />
        ))
      ) : (
        <p className="chat-empty">No messages yet</p>
      )}

      <div ref={scrollRef} />
    </div>
  );
}