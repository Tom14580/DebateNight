import { useNavigate } from "react-router-dom"

export default function RoomCard({ roomId, topic, status, users }) {
    const navigate = useNavigate();
    let statusClassName = "badge-waiting"
    if (status == "active") {
        statusClassName = "badge-active"
    } else if (status == "finished") {
        statusClassName = "badge-finished"
    }

    return (
    <div className="card flex-col">
        <div className="flex-between">
            <h3>{topic}</h3>
            <span className={`badge ${statusClassName}`}>
                {status}
            </span>
        </div>

        <p className="mt-sm">
            {users.length}/2 participants
        </p>

        <button
            className="btn btn-primary mt-md"
            disabled={status !== "waiting" || users.length >= 2}
            onClick={() => navigate(`/rooms/${roomId}`)}
            >
            {users.length >= 2 ? "Full" : "Join"}
        </button>
    </div>
  );
}