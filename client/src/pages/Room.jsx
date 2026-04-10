import { useParams } from "react-router";
import useRoomHook from "../hooks/useRoom";
import RoomPage from "../components/Room/RoomPage";
import SidePicker from "../components/Room/SidePicker";

export default function Room() {
  const { roomId } = useParams();
  let displayName = localStorage.getItem("displayName");
  if (!displayName) {
    displayName = "Anonymous";
  }

  const { room, opponentSide, debateStarted, socket, messages, currentUserId } = useRoomHook(
    roomId,
    displayName,
  );

  return debateStarted ? (
    <RoomPage
      room={room}
      displayName={displayName}
      socket={socket}
      opponentSide={opponentSide}
      userId={currentUserId}
      messages={messages}
    ></RoomPage>
  ) : (
    <SidePicker room={room} opponentSide={opponentSide} socket={socket} />
  );
}
