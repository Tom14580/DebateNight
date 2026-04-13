import { useState } from "react";
import "../../styles/ChatInput.css";

export default function ChatInput({
  socket,
  userId,
  roomId,
  displayName,
  side,
  disabled,
}) {
  const [inputText, setInputText] = useState("");

  function handleSend() {
    if (inputText.trim() === "") return;

    socket.emit("send-message", {
      roomId,
      text: inputText,
      displayName,
      side,
      userId,
    });

    setInputText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-input-container">
      <div className="chat-input-row">
        <input
          className="input"
          maxLength={3000}
          disabled={disabled}
          value={inputText}
          type="text"
          placeholder={disabled ? "Debate not active..." : "Type your argument..."}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="btn btn-primary"
          disabled={disabled}
          onClick={handleSend}
        >
          Send
        </button>
      </div>

      <div className="chat-input-meta">
        <span>{inputText.length}/3000</span>
      </div>
    </div>
  );
}