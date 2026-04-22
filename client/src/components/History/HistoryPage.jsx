import { useState } from "react";
import HistoryRoomCard from "./HistoryRoomCard";
import "../../styles/HistoryPage.css";

export default function HistoryPage({ roomsList, API_URL, handleDelete }) {
  const [search, setSearch] = useState("");

  const filteredRooms =
    roomsList?.filter((room) =>
      room.topic.toLowerCase().includes(search.toLowerCase())
    ) || [];
  return (
    <div className="history-page container">
      <div className="history-header">
        <div>
          <h1>Debate History</h1>
          <p>
            View past debates and revisit previous arguments.
          </p>
        </div>
      </div>

      <div className="history-controls mt-lg">
        <input
          className="input history-search"
          placeholder="Search past topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="history-list mt-lg">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <HistoryRoomCard
              key={room.id}
              roomId={room.id}
              topic={room.topic}
              status={room.status}
              date={room.created_at}
              API_URL={API_URL}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <p className="mt-md history-empty">
            No previous rooms available
          </p>
        )}
      </div>
    </div>
  );
}