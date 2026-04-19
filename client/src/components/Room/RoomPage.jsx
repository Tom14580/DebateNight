import OpponentStatus from "./OpponentStatus";
import ChatWindow from "../Chat/ChatWindow";
import ChatInput from "../Chat/ChatInput";
import "../../styles/RoomPage.css";

export default function RoomPage({
  room,
  displayName,
  socket,
  opponentSide,
  userId,
  messages,
}) {
  if (!room) {
    return <div className="container">Loading room...</div>;
  }

  const opponent = room.users.find(
    (user) => user.socketId !== socket.id
  );

  const opponentName = opponent
    ? opponent.displayName
    : "Waiting...";

  let side = "For";
  if (opponentSide === "For") {
    side = "Against";
  }

  return (
    <div className="container flex-col room-page">
      <div className="room-header">
        {room.status !== "finished" && <OpponentStatus
          room={room}
          opponentName={opponentName}
          opponentSide={opponentSide}
        />}

        <div className="room-meta">
          <h2 className="room-topic">{room.topic}</h2>

          <span
            className={`badge ${
              room.status === "waiting"
                ? "badge-waiting"
                : room.status === "in-progress"
                ? "badge-active"
                : "badge-finished"
            }`}
          >
            {room.status}
          </span>
        </div>
      </div>

      <ChatWindow messages={messages} userId={userId} />

      <ChatInput
        socket={socket}
        userId={userId}
        roomId={room.id}
        displayName={displayName}
        side={side}
        disabled={room.status !== "in-progress"}
      />
    </div>
  );
}