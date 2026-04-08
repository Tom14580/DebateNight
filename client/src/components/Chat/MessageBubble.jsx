import "../../styles/MessageBubble.css";

export default function MessageBubble({
  displayName,
  side,
  text,
  timestamp,
  myUserId,
  messageUserId,
}) {
  const isMine = myUserId == messageUserId;

  const sideClass = side === "For" ? "message-for" : "message-against";

  return (
    <div className={`message-row ${isMine ? "mine" : "theirs"}`}>
      <div className={`message ${sideClass}`}>
        <div className="message-header">
          <span className="message-name">{displayName}</span>
          <span className="message-side">({side})</span>
        </div>

        <div className="message-text">{text}</div>

        <div className="message-time">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}