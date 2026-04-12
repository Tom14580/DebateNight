import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "./RoomCard";
import CreateRoomModal from "./CreateRoomModal";
import "../../styles/LobbyPage.css";

export default function LobbyPage({ roomsList, topicsList }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async (topic) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/api/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      throw new Error("Failed to create room");
    }

    const newRoom = await response.json();
    navigate(`/rooms/${newRoom.id}`);
  };

  const filteredRooms =
    roomsList?.filter((room) =>
      room.topic.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="lobby-page container">
      <div className="lobby-header flex-between">
        <div>
          <h1 className="lobby-title">Debate Lobby</h1>
          <p className="lobby-subtitle">
            Join an open room or create a new debate.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          Create Room
        </button>
      </div>

      <div className="lobby-controls mt-lg">
        <input
          className="input lobby-search"
          placeholder="Search topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="room-list mt-lg">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              roomId={room.id}
              topic={room.topic}
              status={room.status}
              users={room.users}
            />
          ))
        ) : (
          <p className="mt-md">No active rooms available</p>
        )}
      </div>

      <CreateRoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        topics={topicsList}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}