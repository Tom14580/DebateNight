import { useParams } from "react-router";
import useRoomHook from "../hooks/useRoom";
import RoomPage from "../components/Room/RoomPage";
import SidePicker from "../components/Room/SidePicker";
import { getUserId } from "../utils/userId";

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
  
  if (!room) {
    return <div>Loading...</div>;
  }

  const userId = currentUserId || getUserId();
  
  return debateStarted || room.status === "finished" ? (
    <RoomPage
      room={room}
      displayName={displayName}
      socket={socket}
      opponentSide={opponentSide}
      userId={userId}
      messages={messages}
    ></RoomPage>
  ) : (
    <SidePicker room={room} opponentSide={opponentSide} socket={socket} />
  );
}
