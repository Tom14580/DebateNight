import { useEffect, useState } from "react";
import "../../styles/SidePicker.css";

export default function SidePicker({ room, opponentSide, socket }) {
    const [choice, setChoice] = useState(null);
    const [chosen, setChosen] = useState(false);

    function handleClick(e) {
        const selectedValue = e.target.value;
        setChoice(selectedValue);
        setChosen(true);
        const roomId = room.id;
        socket.emit("select-side", { roomId, side: selectedValue });
    }
    
    let waitingForOpponent = true;
    if (room) {
        waitingForOpponent = room.users.length < 2;
    }
    
    return (
        <div className="container center">
        <div className="card side-picker">
            <h2 className="side-title">
            {chosen ? "Waiting for opponent..." : waitingForOpponent ? "Waiting for opponent" : "Choose Your Side"}
            </h2>

            <div className="side-options mt-md">
            <button
                className="btn side-btn for"
                value="For"
                onClick={handleClick}
                disabled={opponentSide === "For" || chosen || waitingForOpponent}
            >
                FOR
            </button>

            <button
                className="btn side-btn against"
                value="Against"
                onClick={handleClick}
                disabled={opponentSide === "Against" || chosen || waitingForOpponent}
            >
                AGAINST
            </button>
            </div>
        </div>
        </div>
    );
}