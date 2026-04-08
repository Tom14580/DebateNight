import "../../styles/OpponentStatus.css";

export default function OpponentStatus({
  room,
  opponentName,
  opponentSide,
}) {
  return (
    <div className="opponent-status">
      <span className="opponent-name">
        {opponentName
          ? `Opponent: ${opponentName}`
          : "Waiting for opponent..."}
      </span>

      {opponentSide && (
        <span
          className={`badge ${
            opponentSide === "For"
              ? "badge-for"
              : "badge-against"
          }`}
        >
          {opponentSide}
        </span>
      )}
    </div>
  );
}