import { useEffect, useState } from "react";
import HistoryPage from "../components/History/HistoryPage";

export default function History() {
    const [roomsList, setRoomsList] = useState([]);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchRooms = async () => {
        try {
            const roomsResponse = await fetch(`${API_URL}/api/rooms`);
            if (!roomsResponse.ok) {
                throw new Error(`Rooms API error: ${roomsResponse.status}`);
            }
            const roomsData = await roomsResponse.json();
            setRoomsList(roomsData.filter(room => room.status === "finished"));
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchRooms();
    }, [])

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <HistoryPage roomsList={roomsList}></HistoryPage>
    );
}