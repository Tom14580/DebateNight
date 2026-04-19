import { useNavigate } from "react-router-dom";

export default function HistoryRoomCard({ roomId, topic, status, date }) {
  const navigate = useNavigate();

  let statusClassName = "badge-waiting";
  if (status === "in-progress") {
    statusClassName = "badge-active";
  } else if (status === "finished") {
    statusClassName = "badge-finished";
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString()
    : null;

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

      <button
        className="btn btn-primary mt-md"
        onClick={() => navigate(`/rooms/${roomId}`)}
      >
        View
      </button>
    </div>
  );
}