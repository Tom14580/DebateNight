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

  
  const formatTime = (timestamp) => {
    if (!timestamp) return "Invalid time";
    const date = new Date(Number(timestamp));
    return isNaN(date.getTime()) ? "Invalid time" : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-row ${isMine ? "theirs" : "mine"}`}>
      <div className={`message ${sideClass}`}>
        <div className="message-header">
          <span className="message-name">{displayName}</span>
          <span className="message-side">({side})</span>
        </div>

        <div className="message-text">{text}</div>

        <div className="message-time">
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}