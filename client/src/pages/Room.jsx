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

  let userId = localStorage.getItem("userId");

  const { room, opponentSide, debateStarted, socket, messages } = useRoomHook(
    roomId,
    displayName,
  );

  return debateStarted ? (
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
