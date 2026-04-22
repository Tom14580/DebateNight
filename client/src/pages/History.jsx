import { useEffect, useState } from "react";
import HistoryPage from "../components/History/HistoryPage";
import { getUserId } from "../utils/userId";
import { toast, Bounce } from "react-toastify";

export default function History() {
    const [roomsList, setRoomsList] = useState([]);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const userId = getUserId();

    const fetchRooms = async () => {
        try {
            const roomsResponse = await fetch(`${API_URL}/api/rooms`);
            if (!roomsResponse.ok) {
                throw new Error(`Rooms API error: ${roomsResponse.status}`);
            }
            const roomsData = await roomsResponse.json();
            const finishedRooms = roomsData.filter(room => room.status === "finished");
            const finalRooms = finishedRooms.filter(room => room.users.some(user => user.userId === userId));
            setRoomsList(finalRooms);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setError(error.message);
        }
    };

    const handleDelete = async (roomId) => {
        try {
            const response = await fetch(`${API_URL}/api/rooms/${roomId}`, {
                method: "DELETE"
            })
            setRoomsList(prev => prev.filter(room => room.id !== roomId));
            toast.success("Room Deleted!");
        } catch (error) {
            console.error("Error deleting room:", error);
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
        <HistoryPage roomsList={roomsList} API_URL={API_URL} handleDelete={handleDelete}></HistoryPage>
    );
}