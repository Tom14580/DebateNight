import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HistoryRoomCard({ roomId, topic, status, date, API_URL, handleDelete }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  let statusClassName = "badge-waiting";
  if (status === "in-progress") {
    statusClassName = "badge-active";
  } else if (status === "finished") {
    statusClassName = "badge-finished";
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString()
    : null;
  

  if (error) {
      return <div>Error: {error}</div>;
  }

  return (
    <div className="card flex-col">
      <div className="flex-between">
        <h3>{topic}</h3>
        <span className={`badge ${statusClassName}`}>
          {status}
        </span>
      </div>

      {formattedDate && (
        <p className="mt-sm history-date">
          {formattedDate}
        </p>
      )}

      <div className="history-actions mt-md">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/rooms/${roomId}`)}
        >
          View
        </button>

        <button
          className="btn btn-danger"
          onClick={() => handleDelete(roomId)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}